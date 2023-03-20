import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

/**
 * @element umb-property-editor-ui-block-list-block-configuration
 */
@customElement('umb-property-editor-ui-block-list-block-configuration')
export class UmbPropertyEditorUIBlockListBlockConfigurationElement extends UmbLitElement {
	static styles = [UUITextStyles];

	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	render() {
		return html`<div>umb-property-editor-ui-block-list-block-configuration</div>`;
	}
}

export default UmbPropertyEditorUIBlockListBlockConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-list-block-configuration': UmbPropertyEditorUIBlockListBlockConfigurationElement;
	}
}
