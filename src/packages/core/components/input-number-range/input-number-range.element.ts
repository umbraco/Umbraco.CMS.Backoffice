import { UmbFormControlMixin } from '@umbraco-cms/backoffice/validation';
import { html, customElement, property, state, type PropertyValueMap, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UUIInputElement } from '@umbraco-cms/backoffice/external/uui';

function getNumberOrUndefined(value: string) {
	const num = parseInt(value, 10);
	return isNaN(num) ? undefined : num;
}

@customElement('umb-input-number-range')
export class UmbInputNumberRangeElement extends UmbFormControlMixin(UmbLitElement) {
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
		const newValue =
			this._minValue || this._maxValue ? (this._minValue ?? '') + ',' + (this._maxValue ?? '') : undefined;
		if (super.value !== newValue) {
			super.value = newValue;
		}
	}

	@property()
	public set value(valueString: string | undefined) {
		if (valueString !== this.value) {
			if (valueString === undefined) {
				this.minValue = this.maxValue = undefined;
				return;
			}
			const splittedValue = valueString.split(/[ ,]+/);
			this.minValue = getNumberOrUndefined(splittedValue[0]);
			this.maxValue = getNumberOrUndefined(splittedValue[1]);
		}
	}
	public get value(): string | undefined {
		return this.minValue || this.maxValue ? (this.minValue || '') + ',' + (this.maxValue || '') : undefined;
	}

	constructor() {
		super();

		this.addValidator(
			'patternMismatch',
			() => {
				return 'The low value must not be exceed the high value';
			},
			() => {
				return this._minValue !== undefined && this._maxValue !== undefined ? this._minValue > this._maxValue : false;
			},
		);
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);
		this.shadowRoot?.querySelectorAll<UUIInputElement>('uui-input').forEach((x) => this.addFormControlElement(x));
	}

	focus() {
		return this.shadowRoot?.querySelector<UUIInputElement>('uui-input')?.focus();
	}

	private _onMinInput(e: InputEvent) {
		const value = Number((e.target as HTMLInputElement).value);
		this.minValue = value ? Number(value) : undefined;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
	}

	private _onMaxInput(e: InputEvent) {
		const value = (e.target as HTMLInputElement).value;
		this.maxValue = value ? Number(value) : undefined;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
	}

	render() {
		return html`<uui-input
				type="number"
				.value=${this._minValue}
				@input=${this._onMinInput}
				label=${this.minLabel}></uui-input>
			<b>–</b>
			<uui-input
				type="number"
				.value=${this._maxValue}
				@input=${this._onMaxInput}
				label=${this.maxLabel}
				placeholder="&infin;"></uui-input>`;
	}

	static styles = css`
		:host(:invalid:not([pristine])) {
			color: var(--uui-color-danger);
		}
		:host(:invalid:not([pristine])) uui-input {
			border-color: var(--uui-color-danger);
		}
	`;
}

export default UmbInputNumberRangeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-number-range': UmbInputNumberRangeElement;
	}
}
