import { UmbBlockGridManagerContext } from '../../context/block-grid-manager.context.js';
import { UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS } from './manifests.js';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { html, customElement, property, state, css, type PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import {
	UmbPropertyValueChangeEvent,
	type UmbPropertyEditorConfigCollection,
} from '@umbraco-cms/backoffice/property-editor';
import type { UmbBlockTypeGroup } from '@umbraco-cms/backoffice/block-type';
import type { UmbBlockGridTypeModel, UmbBlockGridValueModel } from '@umbraco-cms/backoffice/block-grid';
import type { NumberRangeValueType } from '@umbraco-cms/backoffice/models';
import '../../components/block-grid-entries/index.js';

/**
 * @element umb-property-editor-ui-block-grid
 */
@customElement('umb-property-editor-ui-block-grid')
export class UmbPropertyEditorUIBlockGridElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#context = new UmbBlockGridManagerContext(this);
	//
	private _value: UmbBlockGridValueModel = {
		layout: {},
		contentData: [],
		settingsData: [],
	};

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		const validationLimit = config.getValueByAlias<NumberRangeValueType>('validationLimit');

		this._limitMin = validationLimit?.min;
		this._limitMax = validationLimit?.max;

		const blocks = config.getValueByAlias<Array<UmbBlockGridTypeModel>>('blocks') ?? [];
		this.#context.setBlockTypes(blocks);

		const blockGroups = config.getValueByAlias<Array<UmbBlockTypeGroup>>('blockGroups') ?? [];
		this.#context.setBlockGroups(blockGroups);

		this.style.maxWidth = config.getValueByAlias<string>('maxPropertyWidth') ?? '';

		//config.useLiveEditing, is covered by the EditorConfiguration of context.
		this.#context.setEditorConfiguration(config);
	}

	//
	@state()
	private _limitMin?: number;
	@state()
	private _limitMax?: number;
	@state()
	private _layoutColumns?: number;

	@property({ attribute: false })
	public set value(value: UmbBlockGridValueModel | undefined) {
		const buildUpValue: Partial<UmbBlockGridValueModel> = value ? { ...value } : {};
		buildUpValue.layout ??= {};
		buildUpValue.contentData ??= [];
		buildUpValue.settingsData ??= [];
		this._value = buildUpValue as UmbBlockGridValueModel;

		this.#context.setLayouts(this._value.layout[UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS] ?? []);
		this.#context.setContents(buildUpValue.contentData);
		this.#context.setSettings(buildUpValue.settingsData);
	}
	public get value(): UmbBlockGridValueModel {
		return this._value;
	}

	constructor() {
		super();

		// TODO: Prevent initial notification from these observes:
		this.observe(this.#context.layouts, (layouts) => {
			this._value = { ...this._value, layout: { [UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS]: layouts } };
			this.dispatchEvent(new UmbPropertyValueChangeEvent());
		});
		this.observe(this.#context.contents, (contents) => {
			this._value = { ...this._value, contentData: contents };
			this.dispatchEvent(new UmbPropertyValueChangeEvent());
		});
		this.observe(this.#context.settings, (settings) => {
			this._value = { ...this._value, settingsData: settings };
			this.dispatchEvent(new UmbPropertyValueChangeEvent());
		});
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);

		this.observe(this.#context.gridColumns, (gridColumns) => {
			if (gridColumns) {
				this._layoutColumns = gridColumns;
				this.style.setProperty('--umb-block-grid--grid-columns', gridColumns.toString());
			}
		});
	}

	render() {
		return html`<umb-block-grid-entries
			.areaKey=${null}
			.layoutColumns=${this._layoutColumns}></umb-block-grid-entries>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: grid;
				gap: 1px;
			}
			> div {
				display: flex;
				flex-direction: column;
				align-items: stretch;
			}

			uui-button-group {
				padding-top: 1px;
				display: grid;
				grid-template-columns: 1fr auto;
			}
		`,
	];
}

export default UmbPropertyEditorUIBlockGridElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-grid': UmbPropertyEditorUIBlockGridElement;
	}
}
