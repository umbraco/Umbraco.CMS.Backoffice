import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('umb-umbraco-news-dashboard')
export class UmbUmbracoNewsDashboardElement extends LitElement {
	render() {
		return html`
			<uui-box>
				<h1>Welcome</h1>
				<p>You can find details about the POC in the readme.md file.</p>
			</uui-box>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbUmbracoNewsDashboardElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-umbraco-news-dashboard': UmbUmbracoNewsDashboardElement;
	}
}
