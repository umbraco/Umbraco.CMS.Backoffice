import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbInputDateElement } from '@umbraco-cms/backoffice/components';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';

/**
 * This property editor allows the user to pick a date, datetime-local, or time.
 * It uses raw datetime strings back and forth, and therefore it has no knowledge
 * of timezones. It uses a regular HTML input element underneath, which supports the known
 * definitions of "date", "datetime-local", and "time".
 *
 * The underlying input element reports the value differently depending on the type configuration. Here
 * are some examples from the change event:
 *
 * date: 2024-05-03
 * datetime-local: 2024-05-03T10:44
 * time: 10:44
 *
 * These values are approximately similar to what Umbraco expects for the Umbraco.DateTime
 * data editor with one exception: the "T" character in "datetime-local". To be backwards compatible, we are
 * replacing the T character with a whitespace, which also happens to work just fine
 * with the "datetime-local" type.
 *
 * @element umb-property-editor-ui-date-picker
 */
@customElement('umb-property-editor-ui-date-picker')
export class UmbPropertyEditorUIDatePickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@state()
	private _inputType: UmbInputDateElement['type'] = 'datetime-local';

	@state()
	private _min?: string;

	@state()
	private _max?: string;

	@state()
	private _step?: number;

	@property()
	value?: string;

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		// Format string prevalue/config
		const format = config.getValueByAlias<string>('format');
		const hasTime = format?.includes('H') || format?.includes('m');
		const hasSeconds = format?.includes('s');
		this._inputType = hasTime ? 'datetime-local' : 'date';

		// Based on the type of format string change the UUI-input type
		// Note: The format string is not validated, so it's possible to have an invalid format string,
		// but we do not use the format string for anything else than to determine the input type.
		// The format string is not used to validate the value and is only used on the frontend.
		const timeFormatPattern = /^h{1,2}:m{1,2}(:s{1,2})?\s?a?$/gim;
		if (format?.toLowerCase().match(timeFormatPattern)) {
			this._inputType = 'time';
		}

		this._min = config.getValueByAlias('min');
		this._max = config.getValueByAlias('max');
		this._step = config.getValueByAlias('step') ?? hasSeconds ? 1 : undefined;

		if (this.value) {
			this.#formatValue(this.value);
		}
	}

	#onChange(event: CustomEvent & { target: UmbInputDateElement }) {
		this.#formatValue(event.target.value.toString());
	}

	/**
	 * Formats the value depending on the input type.
	 */
	#formatValue(value: string) {
		// Replace the T character with a whitespace to be backwards compatible with Umbraco.DateTime
		value = value.replace('T', ' ');

		// If we have a whitespace, we need special handling for "time" and "date"
		// This could happen both on the way in and out
		if (value.includes(' ')) {
			// If the input type is "time", we need to remove the date part
			if (this._inputType === 'time') {
				value = value.split(' ')[1];
			}

			// If the input type is "date", we need to remove the time part
			else if (this._inputType === 'date') {
				value = value.split(' ')[0];
			}
		}

		this.#syncValue(value);
	}

	#syncValue(value: string) {
		const valueHasChanged = this.value !== value;
		if (valueHasChanged) {
			this.value = value;
			this.dispatchEvent(new UmbPropertyValueChangeEvent());
		}
	}

	override render() {
		return html`
			<umb-input-date
				.value=${this.value}
				.min=${this._min}
				.max=${this._max}
				.step=${this._step}
				.type=${this._inputType}
				@change=${this.#onChange}>
			</umb-input-date>
		`;
	}
}

export default UmbPropertyEditorUIDatePickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-date-picker': UmbPropertyEditorUIDatePickerElement;
	}
}
