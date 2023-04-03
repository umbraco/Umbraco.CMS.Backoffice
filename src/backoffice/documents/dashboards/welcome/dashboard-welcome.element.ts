import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('umb-dashboard-welcome')
export class UmbDashboardWelcomeElement extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
		`,
	];

	render() {
		return html`
			<uui-box>
				<h1>Welcome</h1>
				<p>You can find details about the POC in the readme.md file.</p>
			</uui-box>
		`;
	}
}

export default UmbDashboardWelcomeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-welcome': UmbDashboardWelcomeElement;
	}
}
