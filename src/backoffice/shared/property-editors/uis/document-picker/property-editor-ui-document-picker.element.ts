import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbInputDocumentPickerElement } from '../../../components/input-document-picker/input-document-picker.element';
import { UmbLitElement } from '@umbraco-cms/element';
import type { DataTypePropertyData } from '@umbraco-cms/models';

@customElement('umb-property-editor-ui-document-picker')
export class UmbPropertyEditorUIContentPickerElement extends UmbLitElement {
	private _value: Array<string> = [];

	@property({ type: Array })
	public get value(): Array<string> {
		return this._value;
	}
	public set value(value: Array<string>) {
		this._value = value || [];
	}

	@property({ type: Array, attribute: false })
	public set config(config: Array<DataTypePropertyData>) {
		const validationLimit = config.find((x) => x.alias === 'validationLimit');

		this._limitMin = (validationLimit?.value as any).min;
		this._limitMax = (validationLimit?.value as any).max;
	}

	@state()
	private _limitMin?: number;
	@state()
	private _limitMax?: number;

	private _onChange(event: CustomEvent) {
		this.value = (event.target as UmbInputDocumentPickerElement).selectedKeys;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	// TODO: Implement mandatory?
	render() {
		return html`
			<umb-input-document-picker
				@change=${this._onChange}
				.selectedKeys=${this._value}
				.min=${this._limitMin}
				.max=${this._limitMax}
				>Add</umb-input-document-picker
			>
		`;
	}
}

export default UmbPropertyEditorUIContentPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-document-picker': UmbPropertyEditorUIContentPickerElement;
	}
}
