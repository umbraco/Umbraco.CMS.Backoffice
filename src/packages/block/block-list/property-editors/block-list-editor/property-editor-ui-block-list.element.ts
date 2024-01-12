import { UMB_BLOCK_LIST_PROPERTY_EDITOR_ALIAS } from './manifests.js';
import { html, customElement, property, state, styleMap, repeat, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import {
	UmbBlockLayoutBaseModel,
	UmbBlockManagerContext,
	UmbBlockTypeBase,
	type UmbBlockValueType,
} from '@umbraco-cms/backoffice/block';
import '../../components/block-list-block/index.js';
import { buildUdi } from '@umbraco-cms/backoffice/utils';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type { NumberRangeValueType } from '@umbraco-cms/backoffice/models';

export interface UmbBlockListLayoutModel extends UmbBlockLayoutBaseModel {}

export interface UmbBlockListValueModel extends UmbBlockValueType<UmbBlockListLayoutModel> {}

/**
 * @element umb-property-editor-ui-block-list
 */
@customElement('umb-property-editor-ui-block-list')
export class UmbPropertyEditorUIBlockListElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	private _value: UmbBlockListValueModel = {
		layout: {},
		contentData: [],
		settingsData: [],
	};

	@property({ attribute: false })
	public get value(): UmbBlockListValueModel {
		return this._value;
	}
	public set value(value: UmbBlockListValueModel | undefined) {
		const buildUpValue: Partial<UmbBlockListValueModel> = value ?? {};
		buildUpValue.layout ??= {};
		buildUpValue.contentData ??= [];
		buildUpValue.settingsData ??= [];
		this._value = buildUpValue as UmbBlockListValueModel;

		this.#context.setLayouts(this._value.layout[UMB_BLOCK_LIST_PROPERTY_EDITOR_ALIAS] ?? []);
		this.#context.setContents(buildUpValue.contentData);
		this.#context.setSettings(buildUpValue.settingsData);
	}

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;
		const validationLimit = config.getValueByAlias<NumberRangeValueType>('validationLimit');

		this._limitMin = validationLimit?.min;
		this._limitMax = validationLimit?.max;

		const blocks = config.getValueByAlias<Array<UmbBlockTypeBase>>('blocks') ?? [];
		this.#context.setBlockTypes(blocks);
		//config.useSingleBlockMode
		//config.useLiveEditing
		//config.useInlineEditingAsDefault
		this.style.maxWidth = config.getValueByAlias<string>('maxPropertyWidth') ?? '';
	}

	@state()
	private _limitMin?: number;
	@state()
	private _limitMax?: number;

	#context = new UmbBlockManagerContext(this);

	@state()
	_layouts: Array<UmbBlockLayoutBaseModel> = [];

	constructor() {
		super();
		// TODO: Prevent initial notification from these observes:
		this.observe(this.#context.layouts, (layouts) => {
			this._value.layout[UMB_BLOCK_LIST_PROPERTY_EDITOR_ALIAS] = layouts;
			// Notify that the value has changed.
			//console.log('layout changed', this._value);

			// TODO: idea: consider inserting an await here, so other changes could appear first? Maybe some mechanism to only fire change event onces?
			this._layouts = layouts;
		});
		this.observe(this.#context.contents, (contents) => {
			this._value.contentData = contents;
			// Notify that the value has changed.
			//console.log('content changed', this._value);
		});
		this.observe(this.#context.settings, (settings) => {
			this._value.settingsData = settings;
			// Notify that the value has changed.
			//console.log('settings changed', this._value);
		});
	}

	#openBlockCatalogue() {
		// Open modal.

		// TEMP Hack:

		const contentElementTypeKey = this.#context.getBlockTypes()[0]!.contentElementTypeKey;

		const contentUdi = buildUdi('element', UmbId.new());
		const settingsUdi = buildUdi('element', UmbId.new());

		this.#context.createBlock(
			{
				contentUdi,
				settingsUdi,
			},
			contentElementTypeKey,
		);
	}

	render() {
		return html` ${repeat(
				this._layouts,
				(x) => x.contentUdi,
				(layoutEntry) =>
					html` <uui-button-inline-create></uui-button-inline-create>
						<umb-property-editor-ui-block-list-block .layout=${layoutEntry}>
						</umb-property-editor-ui-block-list-block>`,
			)}
			<uui-button id="add-button" look="placeholder" @click=${this.#openBlockCatalogue} label="open">Add</uui-button>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			> div {
				display: flex;
				flex-direction: column;
				align-items: stretch;
			}
		`,
	];
}

export default UmbPropertyEditorUIBlockListElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-list': UmbPropertyEditorUIBlockListElement;
	}
}
