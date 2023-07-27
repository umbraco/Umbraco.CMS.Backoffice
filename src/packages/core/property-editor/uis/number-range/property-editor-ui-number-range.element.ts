import type { UmbInputNumberRangeElement } from '../../../components/input-number-range/input-number-range.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { UmbPropertyEditorExtensionElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbDataTypeConfigCollection } from '@umbraco-cms/backoffice/components';

import '../../../components/input-number-range/input-number-range.element.js';

type ValueType = {
	min?: number;
	max?: number;
};

/**
 * @element umb-property-editor-ui-number-range
 */
@customElement('umb-property-editor-ui-number-range')
export class UmbPropertyEditorUINumberRangeElement extends UmbLitElement implements UmbPropertyEditorExtensionElement {
	@property({ type: Object })
	private _value: ValueType = { min: undefined, max: undefined };
	public get value() {
		return this._value;
	}
	public set value(value: ValueType | undefined) {
		this._value = value || { min: undefined, max: undefined };
		this._minValue = value?.min;
		this._maxValue = value?.max;
	}

	@property({ attribute: false })
	public config?: UmbDataTypeConfigCollection;

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

	static styles = [UUITextStyles];
}

export default UmbPropertyEditorUINumberRangeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-number-range': UmbPropertyEditorUINumberRangeElement;
	}
}
