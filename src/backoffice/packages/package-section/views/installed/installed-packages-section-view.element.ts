import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IRoute, IRoutingInfo } from 'router-slot';
import type { ManifestWorkspace } from '@umbraco-cms/models';
import { createExtensionElement, umbExtensionsRegistry } from '@umbraco-cms/extensions-api';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-installed-packages-section-view')
export class UmbInstalledPackagesSectionViewElement extends UmbLitElement {
	static styles = [
		css`
			:host {
				display: block;
			}
		`,
	];

	@state()
	private _routes: IRoute[] = [];

@customElement('umb-installed-packages-section-view')
export class UmbInstalledPackagesSectionView extends UmbLitElement {
	@state()
	private _installedPackages: UmbPackage[] = [];

	private repository: UmbPackageRepository;

	constructor() {
		super();

		this.repository = new UmbPackageRepository(this);
	}

	firstUpdated() {
		this._loadInstalledPackages();
	}

	/**
	 * Fetch the installed packages from the server
	 */
	private async _loadInstalledPackages() {
		const package$ = await this.repository.rootItems();
		package$.subscribe((packages) => {
			this._installedPackages = packages.filter((p) => !!p.name);
		});

		routes.push({
			path: '**',
			redirectTo: 'overview',
		});
		this._routes = routes;
	}

	render() {
		return html`<uui-box headline="Installed packages">
			<uui-ref-list>
				${repeat(
					this._installedPackages,
					(item) => item.name,
					(item) =>
						html`<umb-installed-packages-section-view-item .package=${item}></umb-installed-packages-section-view-item>`
				)}
			</uui-ref-list>
		</uui-box>`;
	}
}

export default UmbInstalledPackagesSectionView;

declare global {
	interface HTMLElementTagNameMap {
		'umb-installed-packages-section-view': UmbInstalledPackagesSectionView;
	}
}
