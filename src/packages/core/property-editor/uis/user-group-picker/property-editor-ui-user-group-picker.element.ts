import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

/**
 * @element umb-property-editor-ui-user-group-picker
 */
@customElement('umb-property-editor-ui-user-group-picker')
export class UmbPropertyEditorUIUserGroupPickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value = '';

	@property({ attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	render() {
		return html`<umb-user-group-input></umb-user-group-input>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUIUserGroupPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-user-group-picker': UmbPropertyEditorUIUserGroupPickerElement;
	}
}
