import { html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { delay, firstValueFrom, map } from 'rxjs';
import { UUIButtonElement } from '@umbraco-ui/uui';

import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '../../../../../core/modal';
import { createExtensionElement, umbExtensionsRegistry } from '@umbraco-cms/extensions-api';

import type { ManifestPackageView } from '@umbraco-cms/models';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-packages-installed-item')
export class UmbPackagesInstalledItem extends UmbLitElement {
	static styles = css`
		:host {
			display: flex;
		}
		#migration {
			margin: var(--uui-size-space-3);
		}
	`;
	@property({ type: Object })
	package!: any; // TODO: Use real type

	@query('#migration')
	private _migrationButton?: UUIButtonElement;

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
		this.findPackageView(this.package.alias);
	}

	private async findPackageView(alias: string) {
		this._packageView = { type: 'packageView', name: 'Cake', alias: alias, meta: { packageAlias: alias } };
		const observable = umbExtensionsRegistry
			?.extensionsOfType('packageView')
			.pipe(map((e) => e.filter((m) => m.meta.packageAlias === alias)));

		if (!observable) {
			return;
		}

		const views = await firstValueFrom(observable);
		if (!views.length) {
			return;
		}

		this._packageView = views[0];
	}

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
				description="hi"
				@open=${this._onClick}>
				${this.package.hasPendingMigrations
					? html`<uui-button @click="${this._onMigration}" slot="tag" color="warning" look="primary" id="migration">
							Run pending package migrations
					  </uui-button>`
					: nothing}
				<uui-action-bar style="display: block" slot="actions">
					${this._packageView
						? html`<uui-button
								look="primary"
								color="positive"
								@click=${this._onConfigure}
								label="Configure"></uui-button>`
						: nothing}
				</uui-action-bar>
			</uui-ref-node-package>
		`;
	}

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
	}

	private _onClick() {
		window.history.pushState({}, '', `/section/packages/view/installed/package/${this.package.key}`);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-packages-installed-item': UmbPackagesInstalledItem;
	}
}
