import { html, css, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js';
import { firstValueFrom, map } from 'rxjs';
import { UUIButtonState } from '@umbraco-ui/uui';

import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '../../../../../core/modal';
import { createExtensionElement, umbExtensionsRegistry } from '@umbraco-cms/extensions-api';

import type { ManifestPackageView } from '@umbraco-cms/models';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-installed-packages-section-view-item')
export class UmbInstalledPackagesSectionViewItem extends UmbLitElement {
	static styles = css`
		:host {
			display: flex;
			min-height: 47px;
		}
	`;

	@property()
	name?: string;

	@property()
	version?: string;

	@property()
	hasPendingMigrations = false;

	@state()
	private _migrationButtonState?: UUIButtonState;

	@state()
	private _packageView?: ManifestPackageView;

	private _modalService?: UmbModalService;

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (modalService: UmbModalService) => {
			this._modalService = modalService;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();

		if (this.name?.length) {
			this.findPackageView(this.name);
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
	}

	async _onMigration() {
		this._migrationButtonState = 'waiting';
		alert('Running migrations for ' + this.name);
		this._migrationButtonState = 'success';
	}

	render() {
		return html`
			<uui-ref-node-package
				name=${ifDefined(this.name)}
				version="${ifDefined(this.version)}"
				@open=${this._onConfigure}
				?disabled="${!this._packageView}">
				<div slot="tag">
					${this.hasPendingMigrations
						? html`<uui-button
								@click="${this._onMigration}"
								.state=${this._migrationButtonState}
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

		this._modalService?.open(element, {
			data: { name: this.name, version: this.version },
			size: 'full',
			type: 'sidebar',
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-installed-packages-section-view-item': UmbInstalledPackagesSectionViewItem;
	}
}
