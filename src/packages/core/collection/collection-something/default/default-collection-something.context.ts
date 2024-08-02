import type { UmbCollectionItemModel, UmbCollectionRootModel } from '../../types.js';
import { UMB_COLLECTION_SOMETHING_CONTEXT } from './default-collection-something.context-token.js';
import type { UmbActionEventContext } from '@umbraco-cms/backoffice/action';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbCollectionRepository } from '@umbraco-cms/backoffice/collection';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import {
	type ManifestRepository,
	umbExtensionsRegistry,
	type ManifestCollectionSomething,
} from '@umbraco-cms/backoffice/extension-registry';
import { UmbArrayState, UmbBooleanState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { debounce, UmbPaginationManager, UmbSelectionManager } from '@umbraco-cms/backoffice/utils';
import {
	UmbRequestReloadChildrenOfEntityEvent,
	UmbRequestReloadStructureForEntityEvent,
} from '@umbraco-cms/backoffice/entity-action';
import { UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';

export class UmbDefaultCollectionSomethingContext<
	ItemType extends UmbCollectionItemModel = UmbCollectionItemModel,
	RootType extends UmbCollectionRootModel = UmbCollectionRootModel,
	RequestArgsType = unknown,
> extends UmbContextBase<UmbDefaultCollectionSomethingContext<ItemType, RootType, RequestArgsType>> {
	/**
	 * Sets the manifest
	 * @param {ManifestTree} manifest
	 * @memberof UmbDefaultTreeContext
	 */
	public set manifest(manifest: ManifestCollectionSomething | undefined) {
		if (this.#manifest === manifest) return;
		this.#manifest = manifest;
		this.#observeRepository();
	}
	public get manifest() {
		return this.#manifest;
	}

	#root = new UmbObjectState<RootType | undefined>(undefined);
	root = this.#root.asObservable();

	#items = new UmbArrayState<ItemType>([], (x) => x.unique);
	items = this.#items.asObservable();

	#hideRoot = new UmbBooleanState(false);
	hideRoot = this.#hideRoot.asObservable();

	public selectableFilter?: (item: ItemType) => boolean = () => true;
	public filter?: (item: ItemType) => boolean = () => true;
	public readonly selection = new UmbSelectionManager(this._host);
	public readonly pagination = new UmbPaginationManager();

	#manifest?: ManifestCollectionSomething;
	#repository?: UmbCollectionRepository<ItemType>;
	#actionEventContext?: UmbActionEventContext;

	#paging = {
		skip: 0,
		take: 50,
	};

	constructor(host: UmbControllerHost) {
		super(host, UMB_COLLECTION_SOMETHING_CONTEXT);
		this.pagination.setPageSize(this.#paging.take);

		// listen for page changes on the pagination manager
		//this.pagination.addEventListener(UmbChangeEvent.TYPE, this.#onPageChange);

		this.consumeContext(UMB_ACTION_EVENT_CONTEXT, (instance) => {
			this.#actionEventContext?.removeEventListener(
				UmbRequestReloadChildrenOfEntityEvent.TYPE,
				this.#onReloadStructureRequest as EventListener,
			);

			this.#actionEventContext?.removeEventListener(
				UmbRequestReloadStructureForEntityEvent.TYPE,
				this.#onReloadStructureRequest as unknown as EventListener,
			);

			this.#actionEventContext = instance;

			this.#actionEventContext.addEventListener(
				UmbRequestReloadChildrenOfEntityEvent.TYPE,
				this.#onReloadStructureRequest as EventListener,
			);

			this.#actionEventContext.addEventListener(
				UmbRequestReloadStructureForEntityEvent.TYPE,
				this.#onReloadStructureRequest as unknown as EventListener,
			);
		});
	}

	/**
	 * Loads the data
	 * @memberof UmbDefaultTreeContext
	 */
	// TODO: debouncing the load method because multiple props can be set at the same time
	// that would trigger multiple load calls. This is a temporary solution to avoid that.
	public load = debounce(() => this.#debouncedLoadTree(), 100);

	/**
	 * Reloads the tree
	 * @memberof UmbDefaultTreeContext
	 */
	public loadMore = () => this.#debouncedLoadTree(true);

	setHideRoot(hideTreeRoot: boolean) {
		this.#hideRoot.setValue(hideTreeRoot);
		// we need to reset the tree if this config changes
		this.#resetData();
		this.load();
	}

	getHideRoot() {
		return this.#hideRoot.getValue();
	}

	#onReloadStructureRequest = () => this.#loadItems();

	#debouncedLoadTree(reload = false) {
		const hideRoot = this.getHideRoot();
		if (hideRoot) {
			this.#loadItems(reload);
			return;
		}
	}

	async #loadRoot() {
		if (!this.#repository?.requestRoot) {
			throw new Error('Collection Something must have a repository with a requestRoot method.');
		}

		const { data } = await this.#repository!.requestRoot();

		if (data) {
			this.#root.setValue(data);
			this.pagination.setTotalItems(1);
		}
	}

	async #loadItems(loadMore = false) {
		const skip = loadMore ? this.#paging.skip : 0;
		const take = loadMore ? this.#paging.take : this.pagination.getCurrentPageNumber() * this.#paging.take;

		const { data } = await this.#repository.requestCollection({ skip, take });

		if (data) {
			if (loadMore) {
				const currentItems = this.#items.getValue();
				this.#items.setValue([...currentItems, ...data.items]);
			} else {
				this.#items.setValue(data.items);
			}

			this.pagination.setTotalItems(data.total);
		}
	}

	#observeRepository() {
		const repositoryAlias = this.manifest?.meta.repositoryAlias;
		if (!repositoryAlias) throw new Error('Collection Something must have a repository alias.');

		new UmbExtensionApiInitializer<ManifestRepository<UmbCollectionRepository<any>>>(
			this,
			umbExtensionsRegistry,
			repositoryAlias,
			[this],
			(permitted, ctrl) => {
				this.#repository = permitted ? ctrl.api : undefined;
				this.#loadRoot();
			},
		);
	}

	#resetData() {
		this.#root.setValue(undefined);
		this.#items.setValue([]);
		this.pagination.clear();
	}

	override destroy(): void {
		this.#actionEventContext?.removeEventListener(
			UmbRequestReloadChildrenOfEntityEvent.TYPE,
			this.#onReloadStructureRequest as EventListener,
		);

		this.#actionEventContext?.removeEventListener(
			UmbRequestReloadStructureForEntityEvent.TYPE,
			this.#onReloadStructureRequest as unknown as EventListener,
		);

		super.destroy();
	}
}

export { UmbDefaultCollectionSomethingContext as api };
