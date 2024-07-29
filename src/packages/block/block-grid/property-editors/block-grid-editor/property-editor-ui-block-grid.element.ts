import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { html, customElement, property, state, css, type PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import '../../components/block-grid-entries/index.js';
import { observeMultiple } from '@umbraco-cms/backoffice/observable-api';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import { UmbFormControlMixin } from '@umbraco-cms/backoffice/validation';
import { UmbBlockGridManagerContext } from '../../context/block-grid-manager.context.js';
import { UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS } from './manifests.js';
import type { UmbBlockTypeGroup } from '@umbraco-cms/backoffice/block-type';
import type { UmbBlockGridTypeModel, UmbBlockGridValueModel } from '@umbraco-cms/backoffice/block-grid';

/**
 * @element umb-property-editor-ui-block-grid
 */
@customElement('umb-property-editor-ui-block-grid')
export class UmbPropertyEditorUIBlockGridElement
	extends UmbFormControlMixin<UmbBlockGridValueModel, typeof UmbLitElement>(UmbLitElement)
	implements UmbPropertyEditorUiElement
{
	#context = new UmbBlockGridManagerContext(this);
	//
	private _value: UmbBlockGridValueModel = {
		layout: {},
		contentData: [],
		settingsData: [],
	};

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		/*const validationLimit = config.getValueByAlias<NumberRangeValueType>('validationLimit');

		this.#limitMin = validationLimit?.min;
		this.#limitMax = validationLimit?.max;*/

		const blocks = config.getValueByAlias<Array<UmbBlockGridTypeModel>>('blocks') ?? [];
		this.#context.setBlockTypes(blocks);

		const blockGroups = config.getValueByAlias<Array<UmbBlockTypeGroup>>('blockGroups') ?? [];
		this.#context.setBlockGroups(blockGroups);

		this.style.maxWidth = config.getValueByAlias<string>('maxPropertyWidth') ?? '';

		//config.useLiveEditing, is covered by the EditorConfiguration of context.
		this.#context.setEditorConfiguration(config);
	}

	@state()
	private _layoutColumns?: number;

	@property({ attribute: false })
	public override set value(value: UmbBlockGridValueModel | undefined) {
		const buildUpValue: Partial<UmbBlockGridValueModel> = value ? { ...value } : {};
		buildUpValue.layout ??= {};
		buildUpValue.contentData ??= [];
		buildUpValue.settingsData ??= [];
		this._value = buildUpValue as UmbBlockGridValueModel;

		this.#context.setLayouts(this._value.layout[UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS] ?? []);
		this.#context.setContents(this._value.contentData);
		this.#context.setSettings(this._value.settingsData);
	}
	public override get value(): UmbBlockGridValueModel {
		return this._value;
	}

	constructor() {
		super();

		// TODO: Prevent initial notification from these observes
		this.consumeContext(UMB_PROPERTY_CONTEXT, (propertyContext) => {
			this.observe(
				observeMultiple([this.#context.layouts, this.#context.contents, this.#context.settings]),
				([layouts, contents, settings]) => {
					this._value = {
						...this._value,
						layout: { [UMB_BLOCK_GRID_PROPERTY_EDITOR_ALIAS]: layouts },
						contentData: contents,
						settingsData: settings,
					};
					propertyContext.setValue(this._value);
				},
				'motherObserver',
			);
		});
	}

	protected override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);

		this.observe(this.#context.gridColumns, (gridColumns) => {
			if (gridColumns) {
				this._layoutColumns = gridColumns;
				this.style.setProperty('--umb-block-grid--grid-columns', gridColumns.toString());
			}
		});
	}

	override render() {
		return html` <umb-block-grid-entries
			.areaKey=${null}
			.layoutColumns=${this._layoutColumns}></umb-block-grid-entries>`;
	}

	static override styles = [
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
