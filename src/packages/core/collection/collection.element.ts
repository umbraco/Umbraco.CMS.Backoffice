import type { UmbCollectionConfiguration } from './types.js';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbExtensionElementAndApiSlotElementBase } from '@umbraco-cms/backoffice/extension-registry';
import type { ManifestCollection } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

const elementName = 'umb-collection';
@customElement(elementName)
export class UmbCollectionElement extends UmbExtensionElementAndApiSlotElementBase<ManifestCollection> {
	getExtensionType() {
		return 'collection';
	}

	getDefaultElementName() {
		return 'umb-collection-default';
	}

	@property({ type: Object, attribute: false })
	set config(newVal: UmbCollectionConfiguration | undefined) {
		this.#config = newVal;
		this.#setConfig();
	}
	get config() {
		return this.#config;
	}
	#config?: UmbCollectionConfiguration;

	/**
	 * Sets the input to readonly mode, meaning value cannot be changed but still able to read and select its content.
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	public get readonly() {
		return this.#readonly;
	}
	public set readonly(value) {
		this.#readonly = value;
		this.#setReadonly();
	}
	#readonly = false;

	protected override apiChanged(api: UmbApi | undefined): void {
		super.apiChanged(api);
		this.#setConfig();
		this.#setReadonly();
	}

	#setConfig() {
		if (!this.#config || !this._api) return;
		// TODO: add type
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this._api.setConfig(this.#config);
	}

	#setReadonly() {
		if (!this._api) return;

		const unique = 'UMB_READ_ONLY_ATTRIBUTE';

		if (this.#readonly) {
			const state = {
				unique,
				message: '',
			};
			// TODO: add type
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this._api.readOnlyState.addState(state);
		} else {
			// TODO: add type
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this._api.readOnlyState.removeState(unique);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCollectionElement;
	}
}
