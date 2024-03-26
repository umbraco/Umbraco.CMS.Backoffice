import type { UmbPropertyEditorConfig } from '../../../property-editor/index.js';
import type { UmbPropertyTypeModel } from '../../types.js';
import type { UmbDataTypeDetailModel } from '@umbraco-cms/backoffice/data-type';
import { UmbDataTypeDetailRepository } from '@umbraco-cms/backoffice/data-type';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, ifDefined, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
@customElement('umb-property-type-based-property')
export class UmbPropertyTypeBasedPropertyElement extends UmbLitElement {
	@property({ type: Object, attribute: false })
	public get property(): UmbPropertyTypeModel | undefined {
		return this._property;
	}
	public set property(value: UmbPropertyTypeModel | undefined) {
		const oldProperty = this._property;
		this._property = value;
		if (this._property?.dataType.unique !== oldProperty?.dataType.unique) {
			this._observeDataType(this._property?.dataType.unique);
		}
	}
	private _property?: UmbPropertyTypeModel;

	@state()
	private _propertyEditorUiAlias?: string;

	@state()
	private _dataTypeData?: UmbPropertyEditorConfig;

	private _dataTypeDetailRepository = new UmbDataTypeDetailRepository(this);
	private _dataTypeObserver?: UmbObserverController<UmbDataTypeDetailModel | undefined>;

	private async _observeDataType(dataTypeUnique?: string) {
		this._dataTypeObserver?.destroy();
		if (dataTypeUnique) {
			// Its not technically needed to have await here, this is only to ensure that the data is loaded before we observe it, and thereby only updating the DOM with the latest data.
			await this._dataTypeDetailRepository.requestByUnique(dataTypeUnique);
			this._dataTypeObserver = this.observe(
				await this._dataTypeDetailRepository.byUnique(dataTypeUnique),
				(dataType) => {
					this._dataTypeData = dataType?.values;
					this._propertyEditorUiAlias = dataType?.editorUiAlias || undefined;
					// If there is no UI, we will look up the Property editor model to find the default UI alias:
					if (!this._propertyEditorUiAlias && dataType?.editorAlias) {
						//use 'dataType.editorAlias' to look up the extension in the registry:
						// TODO: lets implement a way to observe once. [NL]
						this.observe(
							umbExtensionsRegistry.byTypeAndAlias('propertyEditorSchema', dataType.editorAlias),
							(extension) => {
								if (!extension) return;
								this._propertyEditorUiAlias = extension?.meta.defaultPropertyEditorUiAlias;
								this.removeControllerByAlias('_observePropertyEditorSchema');
							},
							'_observePropertyEditorSchema',
						);
					} else {
						this.removeControllerByAlias('_observePropertyEditorSchema');
					}
				},
				'_observeDataType',
			);
		}
	}

	render() {
		return html`<umb-property
			alias=${ifDefined(this._property?.alias)}
			label=${ifDefined(this._property?.name)}
			description=${ifDefined(this._property?.description || undefined)}
			property-editor-ui-alias=${ifDefined(this._propertyEditorUiAlias)}
			.config=${this._dataTypeData}></umb-property>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-type-based-property': UmbPropertyTypeBasedPropertyElement;
	}
}
