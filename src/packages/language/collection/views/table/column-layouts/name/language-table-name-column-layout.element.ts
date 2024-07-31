import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, LitElement, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';

@customElement('umb-language-table-name-column-layout')
export class UmbLanguageTableNameColumnLayoutElement extends LitElement {
	@property({ attribute: false })
	value!: { unique: string; name: string; editPath: string };

	override render() {
		if (!this.value) return nothing;
		return html` <uui-button compact href=${this.value.editPath} label=${this.value.name}></uui-button> `;
	}

	static override styles = [UmbTextStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-table-name-column-layout': UmbLanguageTableNameColumnLayoutElement;
	}
}
