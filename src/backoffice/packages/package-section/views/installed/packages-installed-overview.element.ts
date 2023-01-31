import { UUITextStyles } from '@umbraco-ui/uui-css';
import { html, css, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import './packages-installed-item.element';

@customElement('umb-packages-installed-overview')
export class UmbPackagesInstalledOverviewElement extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
			uui-box {
				margin-top: var(--uui-size-space-5);
				padding-bottom: var(--uui-size-space-1);
			}

			umb-packages-installed-item {
				padding: var(--uui-size-space-3) 0 var(--uui-size-space-2);
			}

			umb-packages-installed-item:not(:first-child) {
				border-top: 1px solid var(--uui-color-border, #d8d7d9);
			}

			.no-packages {
				display: flex;
				justify-content: space-around;
			}
		`,
	];
	//@state()
	//private _installedPackages: any[] = []; // TODO: Use real type

	@state()
	private _installedPackages: any[] = [
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

	@state()
	private _errorMessage = '';

	firstUpdated() {
		this._loadInstalledPackages();
	}

	/**
	 * Fetch the installed packages from the server
	 */
	private async _loadInstalledPackages() {
		this._errorMessage = '';

		// TODO: Implement when API is ready
		// try {
		// 	const {
		// 		data: { packages },
		// 	} = await getPackagesInstalled({});
		// 	this._installedPackages = packages;
		// } catch (e) {
		// 	if (e instanceof getPackagesInstalled.Error) {
		// 		const error = e.getActualType();
		// 		this._errorMessage = error.data.detail ?? 'An error occurred while loading the installed packages';
		// 	}
		// }
	}

	render() {
		if (this._installedPackages.length) return html`${this._renderInstalled()}`;
		return html`<div class="no-packages">
			<h2><strong>No packages have been installed</strong></h2>
			<p>
				Browse through the available packages using the <strong>'Packages'</strong> icon in the top right of your screen
			</p>
		</div>`;
	}

	private _renderInstalled() {
		return html`<uui-box headline="Installed packages" style="--uui-box-default-padding:0">
			${this._errorMessage ? html`<uui-error-message>${this._errorMessage}</uui-error-message>` : nothing}
			<uui-ref-list>
				${repeat(
					this._installedPackages,
					(item) => item.id,
					(item) => html`<umb-packages-installed-item .package=${item}></umb-packages-installed-item>`
				)}
			</uui-ref-list>
		</uui-box>`;
	}
}

export default UmbPackagesInstalledOverviewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-packages-installed': UmbPackagesInstalledOverviewElement;
	}
}
