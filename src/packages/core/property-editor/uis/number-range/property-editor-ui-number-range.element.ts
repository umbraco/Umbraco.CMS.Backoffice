import type { UmbInputNumberRangeElement } from '../../../components/input-number-range/input-number-range.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { NumberRangeValueType } from '@umbraco-cms/backoffice/models';

import '../../../components/input-number-range/input-number-range.element.js';

/**
 * @element umb-property-editor-ui-number-range
 */
@customElement('umb-property-editor-ui-number-range')
export class UmbPropertyEditorUINumberRangeElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Object })
	public set value(value: NumberRangeValueType | undefined) {
		this._value = value || { min: undefined, max: undefined };
		this._minValue = value?.min;
		this._maxValue = value?.max;
	}
	public get value() {
		return this._value;
	}
	private _value: NumberRangeValueType = { min: undefined, max: undefined };

	@property({ attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	private _onChange(event: CustomEvent) {
		this.value = {
			min: (event.target as UmbInputNumberRangeElement).minValue,
			max: (event.target as UmbInputNumberRangeElement).maxValue,
		};
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	@state()
	_minValue?: number;
	@state()
	_maxValue?: number;

	render() {
		return html`<umb-input-number-range
			.minValue=${this._minValue}
			.maxValue=${this._maxValue}
			@change=${this._onChange}></umb-input-number-range>`;
	}
}

export default UmbPropertyEditorUINumberRangeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-number-range': UmbPropertyEditorUINumberRangeElement;
	}
}
