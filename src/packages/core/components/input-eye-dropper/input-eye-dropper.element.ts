import { customElement, html, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UUIFormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { UUIColorPickerChangeEvent } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-input-eye-dropper')
export class UmbInputEyeDropperElement extends UUIFormControlMixin(UmbLitElement, '') {
	protected getFormElement() {
		return undefined;
	}

	#onChange(e: UUIColorPickerChangeEvent) {
		e.stopPropagation();
		this.value = e.target.value;
		this.dispatchEvent(new UmbChangeEvent());
	}

	@property({ type: Boolean })
	opacity = false;

	@property({ type: Array })
	swatches: string[] = [];

	//TODO if empty swatches, the color picker still shows the area where they are supposed to be rendered.
	// BTW in the old backoffice "palette" seemed to be true/false setting, but here its an array.

	render() {
		return html`
			<uui-color-picker
				label="Eye dropper"
				.opacity=${this.opacity}
				.swatches=${this.swatches}
				.value=${this.value as string}
				@change=${this.#onChange}>
			</uui-color-picker>
		`;
	}
}

export default UmbInputEyeDropperElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-eye-dropper': UmbInputEyeDropperElement;
	}
}
