import { html, css, nothing, ifDefined, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import type { UUIButtonState } from '@umbraco-cms/backoffice/external/uui';
import { map } from '@umbraco-cms/backoffice/external/rxjs';
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';
import { createExtensionElement } from '@umbraco-cms/backoffice/extension-api';
import type { ManifestPackageView } from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { PackageResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';

@customElement('umb-installed-packages-section-view-item')
export class UmbInstalledPackagesSectionViewItemElement extends UmbLitElement {
	@property()
	public get name(): string | undefined {
		return this.#name;
	}
	public set name(value: string | undefined) {
		const oldValue = this.#name;
		if (oldValue === value) return;
		this.#name = value;
		this.#observePackageView();
		this.requestUpdate('name', oldValue);
	}
	#name?: string | undefined;

	@property()
	version?: string | null;

	@property({ type: Boolean, attribute: false })
	hasPendingMigrations = false;

	@property()
	customIcon?: string;

	@state()
	private _migrationButtonState?: UUIButtonState;

	@state()
	private _packageView?: ManifestPackageView;

	#notificationContext?: UmbNotificationContext;

	constructor() {
		super();

		this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
			this.#notificationContext = instance;
		});
	}

	#observePackageView() {
		this.observe(
			umbExtensionsRegistry.byType('packageView').pipe(
				map((extensions) => {
					return extensions.filter((extension) => extension.meta.packageName === this.#name);
				}),
			),
			(manifests) => {
				if (manifests.length === 0) {
					this._packageView = undefined;
					return;
				}
				this._packageView = manifests[0];
			},
			'_observePackageViewExtension',
		);
	}

	async _onMigration() {
		if (!this.name) return;

		await umbConfirmModal(this, {
			color: 'positive',
			headline: `Run migrations for ${this.name}?`,
			content: `Do you want to start run migrations for ${this.name}`,
			confirmLabel: 'Run migrations',
		});

		this._migrationButtonState = 'waiting';
		const { error } = await tryExecuteAndNotify(
			this,
			PackageResource.postPackageByNameRunMigration({ name: this.name }),
		);
		if (error) return;
		this.#notificationContext?.peek('positive', { data: { message: 'Migrations completed' } });
		this._migrationButtonState = 'success';
		this.hasPendingMigrations = false;
	}

	render() {
		return this.name
			? html`
					<uui-ref-node-package
						name=${ifDefined(this.name)}
						version="${ifDefined(this.version ?? undefined)}"
						@open=${this._onConfigure}
						?disabled="${!this._packageView}">
						${this.customIcon ? html`<umb-icon slot="icon" name="${this.customIcon}"></umb-icon>` : nothing}
						<div slot="tag">
							${this.hasPendingMigrations
								? html`<uui-button
										@click="${this._onMigration}"
										.state=${this._migrationButtonState}
										color="warning"
										look="primary"
										label="Run pending package migrations">
										Run pending migrations
								  </uui-button>`
								: nothing}
						</div>
					</uui-ref-node-package>
			  `
			: '';
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

		// TODO: add dedicated modal for package views, and register it in a manifest.
		alert('package view modal temporarily disabled. See comment in code.');
		/*
		this._modalContext?.open(this, element, {
			data: { name: this.name, version: this.version },
			size: 'full',
			type: 'sidebar',
		});
		*/
	}

	static styles = css`
		:host {
			display: flex;
			min-height: 47px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-installed-packages-section-view-item': UmbInstalledPackagesSectionViewItemElement;
	}
}
