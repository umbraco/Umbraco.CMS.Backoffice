import type { UmbBlockWorkspaceOriginData } from '../workspace/index.js';
import type { UmbBlockLayoutBaseModel, UmbBlockDataType } from '../types.js';
import { UMB_BLOCK_MANAGER_CONTEXT } from './block-manager.context-token.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState, UmbBooleanState, UmbClassState, UmbStringState } from '@umbraco-cms/backoffice/observable-api';
import { UmbDocumentTypeDetailRepository } from '@umbraco-cms/backoffice/document-type';
import type { UmbContentTypeModel } from '@umbraco-cms/backoffice/content-type';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { UmbBlockTypeBaseModel } from '@umbraco-cms/backoffice/block-type';

/**
 *
 * @param {string} entityType - The entity type
 * @param {string} guid - The entity
 * @returns {string} UDI in the format `umb://<entityType>/<guid>`
 */
function buildUdi(entityType: string, guid: string) {
	return `umb://${entityType}/${guid.replace(/-/g, '')}`;
}

export type UmbBlockDataObjectModel<LayoutEntryType extends UmbBlockLayoutBaseModel> = {
	layout: LayoutEntryType;
	content: UmbBlockDataType;
	settings?: UmbBlockDataType;
};
export abstract class UmbBlockManagerContext<
	BlockType extends UmbBlockTypeBaseModel = UmbBlockTypeBaseModel,
	BlockLayoutType extends UmbBlockLayoutBaseModel = UmbBlockLayoutBaseModel,
	BlockOriginDataType extends UmbBlockWorkspaceOriginData = UmbBlockWorkspaceOriginData,
> extends UmbContextBase<UmbBlockManagerContext> {
	//
	get contentTypesLoaded() {
		return Promise.all(this.#contentTypeRequests);
	}
	#contentTypeRequests: Array<Promise<unknown>> = [];
	#contentTypeRepository = new UmbDocumentTypeDetailRepository(this);

	#propertyAlias = new UmbStringState(undefined);
	propertyAlias = this.#propertyAlias.asObservable();

	#variantId = new UmbClassState<UmbVariantId | undefined>(undefined);
	variantId = this.#variantId.asObservable();

	#contentTypes = new UmbArrayState(<Array<UmbContentTypeModel>>[], (x) => x.unique);
	public readonly contentTypes = this.#contentTypes.asObservable();

	#blockTypes = new UmbArrayState(<Array<BlockType>>[], (x) => x.contentElementTypeKey);
	public readonly blockTypes = this.#blockTypes.asObservable();

	protected _editorConfiguration = new UmbClassState<UmbPropertyEditorConfigCollection | undefined>(undefined);
	public readonly editorConfiguration = this._editorConfiguration.asObservable();

	protected _liveEditingMode = new UmbBooleanState(undefined);
	public readonly liveEditingMode = this._liveEditingMode.asObservable();

	protected _layouts = new UmbArrayState(<Array<BlockLayoutType>>[], (x) => x.contentUdi);
	public readonly layouts = this._layouts.asObservable();

	#contents = new UmbArrayState(<Array<UmbBlockDataType>>[], (x) => x.udi);
	public readonly contents = this.#contents.asObservable();

	#settings = new UmbArrayState(<Array<UmbBlockDataType>>[], (x) => x.udi);
	public readonly settings = this.#settings.asObservable();

	setEditorConfiguration(configs: UmbPropertyEditorConfigCollection) {
		this._editorConfiguration.setValue(configs);
		if (this._liveEditingMode.getValue() === undefined) {
			this._liveEditingMode.setValue(configs.getValueByAlias<boolean>('liveEditingMode'));
		}
	}
	getEditorConfiguration(): UmbPropertyEditorConfigCollection | undefined {
		return this._editorConfiguration.getValue();
	}

	setBlockTypes(blockTypes: Array<BlockType>) {
		this.#blockTypes.setValue(blockTypes);
	}
	getBlockTypes() {
		return this.#blockTypes.value;
	}

	setLayouts(layouts: Array<BlockLayoutType>) {
		this._layouts.setValue(layouts);
	}
	getLayouts() {
		return this._layouts.getValue();
	}
	setContents(contents: Array<UmbBlockDataType>) {
		this.#contents.setValue(contents);
	}
	setSettings(settings: Array<UmbBlockDataType>) {
		this.#settings.setValue(settings);
	}

	constructor(host: UmbControllerHost) {
		super(host, UMB_BLOCK_MANAGER_CONTEXT);

		this.consumeContext(UMB_PROPERTY_CONTEXT, (propertyContext) => {
			this.observe(
				propertyContext?.alias,
				(alias) => {
					this.#propertyAlias.setValue(alias);
				},
				'observePropertyAlias',
			);
			this.observe(
				propertyContext?.variantId,
				(variantId) => {
					this.#variantId.setValue(variantId);
				},
				'observePropertyVariantId',
			);
		});

		this.observe(this.blockTypes, (blockTypes) => {
			blockTypes.forEach((x) => {
				this.#ensureContentType(x.contentElementTypeKey);
				if (x.settingsElementTypeKey) {
					this.#ensureContentType(x.settingsElementTypeKey);
				}
			});
		});
	}

	async #ensureContentType(unique: string) {
		if (this.#contentTypes.getValue().find((x) => x.unique === unique)) return;

		const contentTypeRequest = this.#contentTypeRepository.requestByUnique(unique);
		this.#contentTypeRequests.push(contentTypeRequest);
		const { data } = await contentTypeRequest;
		if (!data) {
			this.#contentTypes.removeOne(unique);
			return;
		}

		// We could have used the global store of Document Types, but to ensure we first react ones the latest is loaded then we have our own local store:
		// TODO: Revisit if this is right to do. Notice this can potentially be proxied to the global store. In that way we do not need to observe and we can just use the global store for data.
		this.#contentTypes.appendOne(data);
	}

	getContentTypeKeyOfContentUdi(contentUdi: string) {
		return this.getContentOf(contentUdi)?.contentTypeKey;
	}
	contentTypeOf(contentTypeKey: string) {
		return this.#contentTypes.asObservablePart((source) => source.find((x) => x.unique === contentTypeKey));
	}
	contentTypeNameOf(contentTypeKey: string) {
		return this.#contentTypes.asObservablePart((source) => source.find((x) => x.unique === contentTypeKey)?.name);
	}
	getContentTypeNameOf(contentTypeKey: string) {
		return this.#contentTypes.getValue().find((x) => x.unique === contentTypeKey)?.name;
	}
	getContentTypeHasProperties(contentTypeKey: string) {
		const properties = this.#contentTypes.getValue().find((x) => x.unique === contentTypeKey)?.properties;
		return properties ? properties.length > 0 : false;
	}
	blockTypeOf(contentTypeKey: string) {
		return this.#blockTypes.asObservablePart((source) =>
			source.find((x) => x.contentElementTypeKey === contentTypeKey),
		);
	}

	layoutOf(contentUdi: string) {
		return this._layouts.asObservablePart((source) => source.find((x) => x.contentUdi === contentUdi));
	}
	contentOf(udi: string) {
		return this.#contents.asObservablePart((source) => source.find((x) => x.udi === udi));
	}
	settingsOf(udi: string) {
		return this.#settings.asObservablePart((source) => source.find((x) => x.udi === udi));
	}

	getBlockTypeOf(contentTypeKey: string) {
		return this.#blockTypes.value.find((x) => x.contentElementTypeKey === contentTypeKey);
	}
	getContentOf(contentUdi: string) {
		return this.#contents.value.find((x) => x.udi === contentUdi);
	}
	// TODO: [v15]: ignoring unused var here here to prevent a breaking change
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setOneLayout(layoutData: BlockLayoutType, originData?: BlockOriginDataType) {
		this._layouts.appendOne(layoutData);
	}
	setOneContent(contentData: UmbBlockDataType) {
		this.#contents.appendOne(contentData);
	}
	setOneSettings(settingsData: UmbBlockDataType) {
		this.#settings.appendOne(settingsData);
	}

	removeOneContent(contentUdi: string) {
		this.#contents.removeOne(contentUdi);
	}
	removeOneSettings(settingsUdi: string) {
		this.#settings.removeOne(settingsUdi);
	}

	setOneContentProperty(udi: string, propertyAlias: string, value: unknown) {
		this.#contents.updateOne(udi, { [propertyAlias]: value });
	}
	setOneSettingsProperty(udi: string, propertyAlias: string, value: unknown) {
		this.#settings.updateOne(udi, { [propertyAlias]: value });
	}

	contentProperty(udi: string, propertyAlias: string) {
		this.#contents.asObservablePart((source) => source.find((x) => x.udi === udi)?.[propertyAlias]);
	}
	settingsProperty(udi: string, propertyAlias: string) {
		this.#contents.asObservablePart((source) => source.find((x) => x.udi === udi)?.[propertyAlias]);
	}

	abstract create(
		contentElementTypeKey: string,
		partialLayoutEntry?: Omit<BlockLayoutType, 'contentUdi'>,
		originData?: BlockOriginDataType,
	): UmbBlockDataObjectModel<BlockLayoutType> | undefined;

	public createBlockSettingsData(contentElementTypeKey: string) {
		const blockType = this.#blockTypes.value.find((x) => x.contentElementTypeKey === contentElementTypeKey);
		if (!blockType) {
			throw new Error(`Cannot create block settings, missing block type for ${contentElementTypeKey}`);
		}
		if (!blockType.settingsElementTypeKey) {
			throw new Error(`Cannot create block settings, missing settings element type for ${contentElementTypeKey}`);
		}

		return {
			udi: buildUdi('element', UmbId.new()),
			contentTypeKey: blockType.settingsElementTypeKey,
		};
	}

	protected createBlockData(contentElementTypeKey: string, partialLayoutEntry?: Omit<BlockLayoutType, 'contentUdi'>) {
		// Find block type.
		const blockType = this.#blockTypes.value.find((x) => x.contentElementTypeKey === contentElementTypeKey);
		if (!blockType) {
			throw new Error(`Cannot create block, missing block type for ${contentElementTypeKey}`);
		}

		// Create layout entry:
		const layout: BlockLayoutType = {
			contentUdi: buildUdi('element', UmbId.new()),
			...(partialLayoutEntry as Partial<BlockLayoutType>),
		} as BlockLayoutType;

		const content = {
			udi: layout.contentUdi,
			contentTypeKey: contentElementTypeKey,
		};
		let settings: UmbBlockDataType | undefined = undefined;

		if (blockType.settingsElementTypeKey) {
			layout.settingsUdi = buildUdi('element', UmbId.new());
			settings = {
				udi: layout.settingsUdi,
				contentTypeKey: blockType.settingsElementTypeKey,
			};
		}

		return {
			layout,
			content,
			settings,
		};
	}

	abstract insert(
		layoutEntry: BlockLayoutType,
		content: UmbBlockDataType,
		settings: UmbBlockDataType | undefined,
		originData: BlockOriginDataType,
	): boolean;

	protected insertBlockData(
		layoutEntry: BlockLayoutType,
		content: UmbBlockDataType,
		settings: UmbBlockDataType | undefined,
	) {
		// Create content entry:
		if (layoutEntry.contentUdi) {
			this.#contents.appendOne(content);
		} else {
			throw new Error('Cannot create block, missing contentUdi');
		}

		//Create settings entry:
		if (settings && layoutEntry.settingsUdi) {
			this.#settings.appendOne(settings);
		}
	}

	protected removeBlockUdi(contentUdi: string) {
		this.#contents.removeOne(contentUdi);
	}
}
