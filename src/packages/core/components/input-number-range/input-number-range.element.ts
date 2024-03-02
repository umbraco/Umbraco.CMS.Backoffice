import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

function getNumberOrUndefined(value: string) {
	const num = parseInt(value, 10);
	return isNaN(num) ? undefined : num;
}

@customElement('umb-input-number-range')
export class UmbInputNumberRangeElement extends FormControlMixin(UmbLitElement) {
	@property({ type: String, attribute: 'min-label' })
	minLabel = 'Low value';

	@property({ type: String, attribute: 'max-label' })
	maxLabel = 'High value';

	@state()
	private _minValue?: number;

	@property({ type: Number })
	public set minValue(value: number | undefined) {
		this._minValue = value;
		this.updateValue();
	}
	public get minValue() {
		return this._minValue;
	}

	@state()
	private _maxValue?: number;

	@property({ type: Number })
	public set maxValue(value: number | undefined) {
		this._maxValue = value;
		this.updateValue();
	}
	public get maxValue() {
		return this._maxValue;
	}

	private updateValue() {
		const newValue = this._minValue || this._maxValue ? (this._minValue || '') + ',' + (this._maxValue || '') : '';
		if (super.value !== newValue) {
			super.value = newValue;
		}
	}

	@property()
	public set value(valueString: string) {
		if (valueString !== this._value) {
			const splittedValue = valueString.split(/[ ,]+/);
			this.minValue = getNumberOrUndefined(splittedValue[0]);
			this.maxValue = getNumberOrUndefined(splittedValue[1]);
		}
	}

	constructor() {
		super();
	}

	protected getFormElement() {
		return this;
	}

	private _onMinInput(e: InputEvent) {
		this.minValue = Number((e.target as HTMLInputElement).value);
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	private _onMaxInput(e: InputEvent) {
		this.maxValue = Number((e.target as HTMLInputElement).value);
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	render() {
		return html`<uui-input
				type="number"
				.value=${this._minValue}
				@input=${this._onMinInput}
				label=${this.minLabel}></uui-input>
			–
			<uui-input
				type="number"
				.value=${this._maxValue}
				@input=${this._onMaxInput}
				label=${this.maxLabel}
				placeholder="&infin;"></uui-input>`;
	}
}

export default UmbInputNumberRangeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-number-range': UmbInputNumberRangeElement;
	}
}
