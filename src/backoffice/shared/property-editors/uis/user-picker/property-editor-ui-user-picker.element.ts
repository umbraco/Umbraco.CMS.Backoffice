import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UmbPropertyEditorElement } from '@umbraco-cms/backoffice/property-editor';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

/**
 * @element umb-property-editor-ui-user-picker
 */
@customElement('umb-property-editor-ui-user-picker')
export class UmbPropertyEditorUIUserPickerElement extends UmbLitElement implements UmbPropertyEditorElement {
	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	// TODO: implement config
	render() {
		return html` <umb-user-input></umb-user-input>`;
	}

	static styles = [UUITextStyles];
}

export default UmbPropertyEditorUIUserPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-user-picker': UmbPropertyEditorUIUserPickerElement;
	}
}
