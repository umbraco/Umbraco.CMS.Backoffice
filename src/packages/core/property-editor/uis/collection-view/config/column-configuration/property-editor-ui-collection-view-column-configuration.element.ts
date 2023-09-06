import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

/**
 * @element umb-property-editor-ui-collection-view-column-configuration
 */
@customElement('umb-property-editor-ui-collection-view-column-configuration')
export class UmbPropertyEditorUICollectionViewColumnConfigurationElement extends UmbLitElement {
	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	render() {
		return html`<div>umb-property-editor-ui-collection-view-column-configuration</div>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUICollectionViewColumnConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-collection-view-column-configuration': UmbPropertyEditorUICollectionViewColumnConfigurationElement;
	}
}
