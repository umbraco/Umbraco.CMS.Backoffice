import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, property, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UUIInputElement } from '@umbraco-cms/backoffice/external/uui';

type UuiInputTypeType = typeof UUIInputElement.prototype.type;

@customElement('umb-property-editor-ui-text-box')
export class UmbPropertyEditorUITextBoxElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#defaultType: UuiInputTypeType = 'text';

	@property()
	value = '';

	@state()
	private _type: UuiInputTypeType = this.#defaultType;

	@state()
	private _inputMode?: string;

	@state()
	private _maxChars?: number;

	@state()
	private _placeholder?: string;

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this._type = config?.getValueByAlias<UuiInputTypeType>('inputType') ?? this.#defaultType;
		this._inputMode = config?.getValueByAlias('inputMode');
		this._maxChars = config?.getValueByAlias('maxChars');
		this._placeholder = config?.getValueByAlias('placeholder');
	}

	private onChange(e: Event) {
		const newValue = (e.target as HTMLInputElement).value;
		if (newValue === this.value) return;
		this.value = newValue;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<uui-input
			.value=${this.value ?? ''}
			.type=${this._type}
			placeholder=${ifDefined(this._placeholder)}
			inputMode=${ifDefined(this._inputMode)}
			maxlength=${ifDefined(this._maxChars)}
			@input=${this.onChange}></uui-input>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbPropertyEditorUITextBoxElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-text-box': UmbPropertyEditorUITextBoxElement;
	}
}
