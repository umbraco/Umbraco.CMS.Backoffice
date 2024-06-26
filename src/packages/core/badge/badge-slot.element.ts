import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-badge-slot')
export class UmbBadgeSlotElement extends UmbLitElement {
	override render() {
		return html`
			<uui-badge>1</uui-badge>
			<slot></slot>
		`;
	}

	static override styles = [css``];
}

export default UmbBadgeSlotElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-badge-slot': UmbBadgeSlotElement;
	}
}
