import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

/**
 * @element umb-property-editor-ui-label
 */
@customElement('umb-property-editor-ui-label')
export class UmbPropertyEditorUILabelElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value = '';

	@property()
	description = '';

	@property({ attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	override render() {
		return html`${this.value ?? ''}`;
	}

	static override styles = [UmbTextStyles];
}

export default UmbPropertyEditorUILabelElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-label': UmbPropertyEditorUILabelElement;
	}
}
