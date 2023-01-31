import { html, css, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './packages-created-item.element';

@customElement('umb-packages-created-overview')
export class UmbPackagesCreatedOverviewElement extends LitElement {
	static styles = [
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
			uui-box {
				margin-top: var(--uui-size-space-5);
				padding-bottom: var(--uui-size-space-1);
			}

			umb-packages-created-item {
				padding: var(--uui-size-space-3) 0 var(--uui-size-space-2);
			}

			umb-packages-created-item:not(:first-child) {
				border-top: 1px solid var(--uui-color-border, #d8d7d9);
			}

			.no-packages {
				display: flex;
				justify-content: space-around;
			}
		`,
	];

	// TODO: implement call to backend
	// TODO: add correct model for created packages
	@state()
	private _createdPackages: any[] = [
		{
			alias: 'my.package',
			key: '2a0181ec-244b-4068-a1d7-2f95ed7e6da6',
			name: 'A created package',
			plans: [],
			version: '1.0.0',
		},
		{
			alias: 'my.package2',
			key: '2a0181ec-244b-4068-a1d7-2f95ed7e6da7',
			name: 'A second created package',
			plans: [],
			version: '1.0.1',
		},
	];

	render() {
		return html`<uui-button look="primary" @click="${this._onClick}" label="Create package">Create package</uui-button>
			${this._renderCreatedPackages()}`;
	}

	private _renderCreatedPackages() {
		if (!this._createdPackages.length) return html`<h2 class="no-packages">No packages have been created yet</h2>`;

		return html`<uui-box headline="Created packages" style="--uui-box-default-padding:0;">
			<uui-ref-list>
				${repeat(
					this._createdPackages,
					(item) => item.key,
					(item) => html`<umb-packages-created-item .package=${item}></umb-packages-created-item>`
				)}
			</uui-ref-list>
		</uui-box>`;
	}

	private _onClick() {
		window.history.pushState({}, '', `/section/packages/view/created/package-builder`);
	}
}

export default UmbPackagesCreatedOverviewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-packages-created-overview': UmbPackagesCreatedOverviewElement;
	}
}
