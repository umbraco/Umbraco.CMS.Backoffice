import { html, nothing, ifDefined, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UUIMenuItemEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbExecutedEvent } from '@umbraco-cms/backoffice/events';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-entity-action')
export class UmbEntityActionElement extends UmbLitElement {
	private _unique?: string | null;
	@property({ type: String })
	public get unique() {
		return this._unique;
	}
	public set unique(value: string | undefined | null) {
		const oldValue = this._unique;
		this._unique = value;
		if (oldValue !== this._unique) {
			this.#createApi();
			this.requestUpdate('unique', oldValue);
		}
	}

	private _manifest?: ManifestEntityAction;
	@property({ type: Object, attribute: false })
	public get manifest() {
		return this._manifest;
	}
	public set manifest(value: ManifestEntityAction | undefined) {
		if (!value) return;
		const oldValue = this._manifest;
		this._manifest = value;
		if (oldValue !== this._manifest) {
			this.#createApi();
			this.requestUpdate('manifest', oldValue);
		}
	}

	async #createApi() {
		if (!this._manifest?.meta.api) return;
		if (this._unique === undefined) return;
		// TODO: Could we provide the manifest to the api constructor? instead, to enable more flexibility. Mainly cause some actions knows their repository. some does not need a repository?
		this.#api = new this._manifest.meta.api(this, this._manifest.meta.repositoryAlias, this.unique);

		// TODO: Fix so when we use a HREF it does not refresh the page?
		this._href = await this.#api.getHref?.();
	}

	#api: any;

	@state()
	_href?: string;

	async #onClickLabel(event: UUIMenuItemEvent) {
		if (!this._href) {
			event.stopPropagation();
			await this.#api.execute();
		}
		this.dispatchEvent(new UmbExecutedEvent());
	}

	// TODO: we need to stop the regular click event from bubbling up to the table so it doesn't select the row.
	// This should probably be handled in the UUI Menu item component. so we don't dispatch a label-click event and click event at the same time.
	#onClick(event: PointerEvent) {
		event.stopPropagation();
	}

	render() {
		return html`
			<uui-menu-item
				label=${ifDefined(this._manifest?.meta.label)}
				href=${this._href}
				@click-label=${this.#onClickLabel}
				@click=${this.#onClick}>
				${this._manifest?.meta.icon
					? html`<uui-icon slot="icon" name="${this._manifest?.meta.icon}"></uui-icon>`
					: nothing}
			</uui-menu-item>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-action': UmbEntityActionElement;
	}
}
