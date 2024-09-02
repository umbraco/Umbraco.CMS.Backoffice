import { html, customElement, property, map, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbSwatchDetails } from '@umbraco-cms/backoffice/models';
import { UMB_VALIDATION_EMPTY_LOCALIZATION_KEY, UmbFormControlMixin } from '@umbraco-cms/backoffice/validation';
import type { UUIColorSwatchesEvent } from '@umbraco-cms/backoffice/external/uui';

/*
 * This wraps the UUI library uui-color-swatches component
 * @element umb-input-color
 */
@customElement('umb-input-color')
export class UmbInputColorElement extends UmbFormControlMixin<string, typeof UmbLitElement>(UmbLitElement) {
	#value = '';
	@property()
	public override set value(value: string) {
		this.#value = value;
	}
	public override get value(): string {
		return this.#value;
	}

	@property({ type: Boolean })
	showLabels = false;

	@property({ type: Array })
	swatches?: Array<UmbSwatchDetails>;

	@property({ type: Boolean })
	required = false;

	@property({ type: String })
	requiredMessage = UMB_VALIDATION_EMPTY_LOCALIZATION_KEY;

	#onChange(event: UUIColorSwatchesEvent) {
		this.value = event.target.value;
		this.dispatchEvent(new UmbChangeEvent());
	}

	protected override getFormElement() {
		return undefined;
	}

	constructor() {
		super();
		this.addValidator(
			'valueMissing',
			() => this.requiredMessage,
			() => this.required && !this.value,
		);
	}

	override render() {
		return html`
			<uui-color-swatches label="Color picker" value=${this.value} @change=${this.#onChange}>
				${this.#renderColors()}
			</uui-color-swatches>
		`;
	}

	#renderColors() {
		if (!this.swatches) return nothing;
		return map(
			this.swatches,
			(swatch) => html`
				<uui-color-swatch label=${swatch.label} value=${swatch.value} .showLabel=${this.showLabels}></uui-color-swatch>
			`,
		);
	}
}

export default UmbInputColorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-color': UmbInputColorElement;
	}
}
