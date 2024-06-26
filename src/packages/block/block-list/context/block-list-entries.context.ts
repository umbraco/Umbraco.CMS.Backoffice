import type { UmbBlockDataType } from '../../block/index.js';
import { UMB_BLOCK_CATALOGUE_MODAL, UmbBlockEntriesContext } from '../../block/index.js';
import { UMB_BLOCK_LIST_WORKSPACE_MODAL, type UmbBlockListWorkspaceData } from '../index.js';
import type { UmbBlockListLayoutModel, UmbBlockListTypeModel } from '../types.js';
import { UMB_BLOCK_LIST_MANAGER_CONTEXT } from './block-list-manager.context-token.js';
import { UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/router';

export class UmbBlockListEntriesContext extends UmbBlockEntriesContext<
	typeof UMB_BLOCK_LIST_MANAGER_CONTEXT,
	typeof UMB_BLOCK_LIST_MANAGER_CONTEXT.TYPE,
	UmbBlockListTypeModel,
	UmbBlockListLayoutModel
> {
	//
	#catalogueModal: UmbModalRouteRegistrationController<typeof UMB_BLOCK_CATALOGUE_MODAL.DATA, undefined>;
	#workspaceModal: UmbModalRouteRegistrationController;

	// We will just say its always allowed for list for now: [NL]
	public readonly canCreate = new UmbBooleanState(true).asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_BLOCK_LIST_MANAGER_CONTEXT);

		this.#catalogueModal = new UmbModalRouteRegistrationController(this, UMB_BLOCK_CATALOGUE_MODAL)
			.addUniquePaths(['propertyAlias', 'variantId'])
			.addAdditionalPath(':view/:index')
			.onSetup((routingInfo) => {
				// Idea: Maybe on setup should be async, so it can retrieve the values when needed? [NL]
				const index = routingInfo.index ? parseInt(routingInfo.index) : -1;
				return {
					data: {
						blocks: this._manager?.getBlockTypes() ?? [],
						blockGroups: [],
						openClipboard: routingInfo.view === 'clipboard',
						blockOriginData: { index: index },
					},
				};
			})
			.observeRouteBuilder((routeBuilder) => {
				this._catalogueRouteBuilderState.setValue(routeBuilder);
			});

		this.#workspaceModal = new UmbModalRouteRegistrationController(this, UMB_BLOCK_LIST_WORKSPACE_MODAL)
			.addUniquePaths(['propertyAlias', 'variantId'])
			.addAdditionalPath('block')
			.onSetup(() => {
				return { data: { entityType: 'block', preset: {} }, modal: { size: 'medium' } };
			})
			.observeRouteBuilder((routeBuilder) => {
				const newPath = routeBuilder({});
				this._workspacePath.setValue(newPath);
			});
	}

	protected _gotBlockManager() {
		if (!this._manager) return;

		this.observe(
			this._manager.layouts,
			(layouts) => {
				this._layoutEntries.setValue(layouts);
			},
			'observeParentLayouts',
		);
		this.observe(
			this.layoutEntries,
			(layouts) => {
				this._manager?.setLayouts(layouts);
			},
			'observeThisLayouts',
		);

		this.observe(
			this._manager.propertyAlias,
			(alias) => {
				this.#catalogueModal.setUniquePathValue('propertyAlias', alias ?? 'null');
				this.#workspaceModal.setUniquePathValue('propertyAlias', alias ?? 'null');
			},
			'observePropertyAlias',
		);

		this.observe(
			this._manager.variantId,
			(variantId) => {
				// TODO: This might not be the property variant ID, but the content variant ID. Check up on what makes most sense?
				this.#catalogueModal.setUniquePathValue('variantId', variantId?.toString());
				this.#workspaceModal.setUniquePathValue('variantId', variantId?.toString());
			},
			'observePropertyAlias',
		);
	}

	getPathForCreateBlock(index: number) {
		return this._catalogueRouteBuilderState.getValue()?.({ view: 'create', index: index });
	}

	getPathForClipboard(index: number) {
		return this._catalogueRouteBuilderState.getValue()?.({ view: 'clipboard', index: index });
	}

	override async setLayouts(layouts: Array<UmbBlockListLayoutModel>) {
		await this._retrieveManager;
		this._manager?.setLayouts(layouts);
	}

	async create(
		contentElementTypeKey: string,
		partialLayoutEntry?: Omit<UmbBlockListLayoutModel, 'contentUdi'>,
		modalData?: UmbBlockListWorkspaceData,
	) {
		await this._retrieveManager;
		return this._manager?.create(contentElementTypeKey, partialLayoutEntry, modalData);
	}

	// insert Block?

	async insert(
		layoutEntry: UmbBlockListLayoutModel,
		content: UmbBlockDataType,
		settings: UmbBlockDataType | undefined,
		modalData: UmbBlockListWorkspaceData,
	) {
		await this._retrieveManager;
		return this._manager?.insert(layoutEntry, content, settings, modalData) ?? false;
	}

	// create Block?
	override async delete(contentUdi: string) {
		// TODO: Loop through children and delete them as well?
		await super.delete(contentUdi);
	}
}
