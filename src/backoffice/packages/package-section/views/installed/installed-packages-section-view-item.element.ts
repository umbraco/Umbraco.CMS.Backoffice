import { html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { delay, firstValueFrom, map } from 'rxjs';
import { UUIButtonElement } from '@umbraco-ui/uui';

import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '../../../../../core/modal';
import { createExtensionElement, umbExtensionsRegistry } from '@umbraco-cms/extensions-api';

import type { ManifestPackageView, UmbPackage } from '@umbraco-cms/models';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-packages-installed-item')
export class UmbPackagesInstalledItem extends UmbLitElement {
	static styles = css`
		:host {
			display: flex;
		}
	`;
	@property({ type: Object })
	package!: UmbPackage;

	@query('#migration')
	private _migrationButton?: UUIButtonElement;

	/*
	@state()
	private _packageView?: ManifestPackageView;

	private _umbModalService?: UmbModalService;

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (modalService) => {
			this._umbModalService = modalService;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();

		if (this.package.name?.length) {
			this.findPackageView(this.package.name);
		}
	}

	private async findPackageView(alias: string) {
		const observable = umbExtensionsRegistry
			?.extensionsOfType('packageView')
			.pipe(map((e) => e.filter((m) => m.meta.packageName === alias)));

		if (!observable) {
			return;
		}

		const views = await firstValueFrom(observable);
		if (!views.length) {
			return;
		}

		this._packageView = views[0];
	}*/

	async _onMigration() {
		if (!this._migrationButton) return;
		this._migrationButton.state = 'waiting';
	}

	render() {
		return html`
			<uui-ref-node-package
				name=${this.package.name}
				version="${this.package.version}"
				author="${this.package.author}"
				@open=${this._onClick}
				?disabled="${!this.package.packageView}">
				<div slot="tag">
					${this.package.hasPendingMigrations
						? html`<uui-button
								@click="${this._onMigration}"
								color="warning"
								look="primary"
								label="Run pending package migrations">
								Run pending package migrations
						  </uui-button>`
						: nothing}
				</div>
			</uui-ref-node-package>
		`;
	}

	/*
	private async _onConfigure() {
		if (!this._packageView) {
			console.warn('Tried to configure package without view');
			return;
		}

		const element = await createExtensionElement(this._packageView);

		if (!element) {
			console.warn('Failed to create package view element');
			return;
		}

		this._umbModalService?.open(element, { data: this.package, size: 'small', type: 'sidebar' });
	}*/

	private async _onClick() {
		window.history.pushState({}, '', `/section/packages/view/installed/package/${this.package.key}`);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-installed-packages-section-view-item': UmbInstalledPackagesSectionViewItemElement;
	}
}
