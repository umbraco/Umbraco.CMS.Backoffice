import { type UmbDefaultCollectionSomethingContext, UMB_COLLECTION_SOMETHING_CONTEXT } from '../../default/index.js';
import type { UmbCollectionItemModel } from '../../../types.js';
import { UMB_COLLECTION_SOMETHING_ITEM_CONTEXT } from '../collection-something-item.context-token.js';
import type { UmbCollectionSomethingItemContext } from '../types.js';
import { map } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbBooleanState, UmbObjectState, UmbStringState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_SECTION_CONTEXT, UMB_SECTION_SIDEBAR_CONTEXT } from '@umbraco-cms/backoffice/section';
import type { UmbSectionContext, UmbSectionSidebarContext } from '@umbraco-cms/backoffice/section';
import type { ManifestCollectionSomethingItem } from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_ACTION_EVENT_CONTEXT, type UmbActionEventContext } from '@umbraco-cms/backoffice/action';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/entity-action';
import { debounce } from '@umbraco-cms/backoffice/utils';

export abstract class UmbCollectionSomethingItemContextBase<CollectionItemType extends UmbCollectionItemModel>
	extends UmbContextBase<UmbCollectionSomethingItemContextBase<CollectionItemType>>
	implements UmbCollectionSomethingItemContext<CollectionItemType>
{
	public unique?: string;
	public entityType?: string;

	#manifest?: ManifestCollectionSomethingItem;

	protected readonly _item = new UmbObjectState<CollectionItemType | undefined>(undefined);
	readonly item = this._item.asObservable();

	#isSelectable = new UmbBooleanState(false);
	readonly isSelectable = this.#isSelectable.asObservable();

	#isSelectableContext = new UmbBooleanState(false);
	readonly isSelectableContext = this.#isSelectableContext.asObservable();

	#isSelected = new UmbBooleanState(false);
	readonly isSelected = this.#isSelected.asObservable();

	#isActive = new UmbBooleanState(false);
	readonly isActive = this.#isActive.asObservable();

	#hasActions = new UmbBooleanState(false);
	readonly hasActions = this.#hasActions.asObservable();

	#path = new UmbStringState('');
	readonly path = this.#path.asObservable();

	#collectionSomethingContext?: UmbDefaultCollectionSomethingContext<CollectionItemType>;
	#sectionContext?: UmbSectionContext;
	#sectionSidebarContext?: UmbSectionSidebarContext;
	#actionEventContext?: UmbActionEventContext;

	constructor(host: UmbControllerHost) {
		super(host, UMB_COLLECTION_SOMETHING_ITEM_CONTEXT);
		this.#consumeContexts();
		window.addEventListener('navigationend', this.#debouncedCheckIsActive);
	}

	/**
	 * Sets the manifest
	 * @param {ManifestCollection} manifest
	 * @memberof UmbCollectionContext
	 */
	public set manifest(manifest: ManifestCollectionSomethingItem | undefined) {
		if (this.#manifest === manifest) return;
		this.#manifest = manifest;
	}
	public get manifest() {
		return this.#manifest;
	}

	public setItem(collectionItem: CollectionItemType | undefined) {
		debugger;
		if (!collectionItem) {
			this._item.setValue(undefined);
			return;
		}

		// Only check for undefined. The tree root has null as unique
		if (collectionItem.unique === undefined) throw new Error('Could not create tree item context, unique is missing');
		this.unique = collectionItem.unique;

		if (!collectionItem.entityType) throw new Error('Could not create tree item context, tree item type is missing');
		this.entityType = collectionItem.entityType;

		this._item.setValue(collectionItem);

		// Update observers:
		this.#observeActions();
		this.#observeIsSelectable();
		this.#observeIsSelected();
		this.#observeSectionPath();
	}

	public toggleContextMenu() {
		if (!this.getItem() || !this.entityType || this.unique === undefined) {
			throw new Error('Could not request children, tree item is not set');
		}

		this.#sectionSidebarContext?.toggleContextMenu(this.getHostElement(), {
			entityType: this.entityType,
			unique: this.unique,
			headline: 'Fill out headline',
		});
	}

	public select() {
		if (this.unique === undefined) throw new Error('Could not select. Unique is missing');
		this.#collectionSomethingContext?.selection.select(this.unique);
	}

	public deselect() {
		if (this.unique === undefined) throw new Error('Could not deselect. Unique is missing');
		this.#collectionSomethingContext?.selection.deselect(this.unique);
	}

	async #consumeContexts() {
		this.consumeContext(UMB_SECTION_CONTEXT, (context) => {
			this.#sectionContext = context;
			this.#observeSectionPath();
		});

		this.consumeContext(UMB_SECTION_SIDEBAR_CONTEXT, (context) => {
			this.#sectionSidebarContext = context;
		});

		this.consumeContext(UMB_COLLECTION_SOMETHING_CONTEXT, (context) => {
			this.#collectionSomethingContext = context;
			this.#observeIsSelectable();
			this.#observeIsSelected();
		});

		this.consumeContext(UMB_ACTION_EVENT_CONTEXT, (instance) => {
			this.#actionEventContext?.removeEventListener(
				UmbRequestReloadStructureForEntityEvent.TYPE,
				this.#onReloadStructureRequest as unknown as EventListener,
			);

			this.#actionEventContext = instance;

			this.#actionEventContext.addEventListener(
				UmbRequestReloadStructureForEntityEvent.TYPE,
				this.#onReloadStructureRequest as unknown as EventListener,
			);
		});
	}

	getItem() {
		return this._item.getValue();
	}

	#observeIsSelectable() {
		if (!this.#collectionSomethingContext) return;
		this.observe(
			this.#collectionSomethingContext.selection.selectable,
			(value) => {
				this.#isSelectableContext.setValue(value);

				// If the tree is selectable, check if this item is selectable
				if (value === true) {
					const isSelectable = this.#collectionSomethingContext?.selectableFilter?.(this.getItem()!) ?? true;
					this.#isSelectable.setValue(isSelectable);
					this.#checkIsActive();
				}
			},
			'observeIsSelectable',
		);
	}

	#observeIsSelected() {
		if (!this.#collectionSomethingContext || !this.unique) return;

		this.observe(
			this.#collectionSomethingContext.selection.selection.pipe(map((selection) => selection.includes(this.unique!))),
			(isSelected) => {
				this.#isSelected.setValue(isSelected);
			},
			'observeIsSelected',
		);
	}

	#observeSectionPath() {
		if (!this.#sectionContext) return;

		this.observe(
			this.#sectionContext.pathname,
			(pathname) => {
				if (!pathname || !this.entityType || this.unique === undefined) return;
				const path = this.constructPath(pathname, this.entityType, this.unique);
				this.#path.setValue(path);
				this.#checkIsActive();
			},
			'observeSectionPath',
		);
	}

	#observeActions() {
		this.observe(
			umbExtensionsRegistry
				.byType('entityAction')
				.pipe(map((actions) => actions.filter((action) => action.forEntityTypes.includes(this.entityType!)))),
			(actions) => {
				this.#hasActions.setValue(actions.length > 0);
			},
			'observeActions',
		);
	}

	#onReloadStructureRequest = async (event: UmbRequestReloadStructureForEntityEvent) => {
		if (!this.unique) return;
		if (event.getUnique() !== this.unique) return;
		if (event.getEntityType() !== this.entityType) return;
		debugger;
	};

	#debouncedCheckIsActive = debounce(() => this.#checkIsActive(), 100);

	#checkIsActive() {
		// don't set the active state if the item is selectable
		const isSelectable = this.#isSelectable.getValue();

		if (isSelectable) {
			this.#isActive.setValue(false);
			return;
		}

		const path = this.#path.getValue();
		const location = window.location.pathname;
		const isActive = location.includes(path);
		this.#isActive.setValue(isActive);
	}

	// TODO: use router context
	constructPath(pathname: string, entityType: string, unique: string | null) {
		// TODO: Encode uniques [NL]
		return `section/${pathname}/workspace/${entityType}/edit/${unique}`;
	}

	override destroy(): void {
		this.#actionEventContext?.removeEventListener(
			UmbRequestReloadStructureForEntityEvent.TYPE,
			this.#onReloadStructureRequest as unknown as EventListener,
		);

		window.removeEventListener('navigationend', this.#debouncedCheckIsActive);

		super.destroy();
	}
}
