import type { UmbEntityBulkActionBase } from './entity-bulk-action.js';
import { UmbActionExecutedEvent } from '@umbraco-cms/backoffice/event';
import { html, ifDefined, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import type { ManifestEntityBulkAction } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { createExtensionApi } from '@umbraco-cms/backoffice/extension-api';

@customElement('umb-entity-bulk-action')
export class UmbEntityBulkActionElement extends UmbLitElement {
	private _selection: Array<string> = [];
	@property({ type: Array, attribute: false })
	public get selection() {
		return this._selection;
	}
	public set selection(value: Array<string>) {
		if (!value || value === this._selection) return;
		const oldValue = this._selection;
		this._selection = value;
		this.#api ? this.#api.setSelection(this._selection) : this.#createApi();
		this.requestUpdate('selection', oldValue);
	}

	private _manifest?: ManifestEntityBulkAction;
	@property({ type: Object, attribute: false })
	public get manifest() {
		return this._manifest;
	}
	public set manifest(value: ManifestEntityBulkAction | undefined) {
		if (!value) return;
		const oldValue = this._manifest;
		this._manifest = value;
		if (oldValue !== this._manifest) {
			this.#createApi();
			this.requestUpdate('manifest', oldValue);
		}
	}

	async #createApi() {
		if (!this._manifest) return;

		this.#api = await createExtensionApi(this._manifest, [this, this._manifest.meta.repositoryAlias, this._selection]);
	}

	#api?: UmbEntityBulkActionBase;

	async #onClick(event: PointerEvent) {
		if (!this.#api) return;
		event.stopPropagation();
		await this.#api.execute();
		this.dispatchEvent(new UmbActionExecutedEvent());
	}

	render() {
		return html`<uui-button
			@click=${this.#onClick}
			label=${ifDefined(this.manifest?.meta.label)}
			color="default"
			look="secondary"></uui-button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-bulk-action': UmbEntityBulkActionElement;
	}
}
