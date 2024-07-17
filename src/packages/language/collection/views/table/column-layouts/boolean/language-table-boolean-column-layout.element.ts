import { html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-language-table-boolean-column-layout')
export class UmbLanguageTableBooleanColumnLayoutElement extends UmbLitElement {
	@property({ attribute: false })
	value = false;

	override render() {
		return this.value ? html`<uui-icon name="icon-check"></uui-icon>` : nothing;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-table-boolean-column-layout': UmbLanguageTableBooleanColumnLayoutElement;
	}
}
