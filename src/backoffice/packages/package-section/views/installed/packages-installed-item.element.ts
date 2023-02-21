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
			align-items: center;
		}
		#actions {
			min-width: 150px;
			margin: var(--uui-size-space-3);
			display: flex;
			flex-direction: row-reverse;
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
					? html`<uui-tag @click="${this._onMigration}" slot="tag" color="warning" look="primary">
							Migration available
					  </uui-tag>`
					: nothing}
				<div id="actions" slot="actions">
					<uui-action-bar>
						${this.package.hasPendingMigrations
							? html`<uui-button id="migration" look="primary" color="warning" @click="${this._onMigration}">
									<uui-icon name="umb:sync"></uui-icon>
							  </uui-button>`
							: nothing}
						${this.package.packageView
							? html`<uui-button color="positive" look="primary" @click="${this._onConfigure}">
									Configuration
							  </uui-button>`
							: nothing}
					</uui-action-bar>
				</div>
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
