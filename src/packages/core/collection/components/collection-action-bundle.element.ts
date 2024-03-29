import type { UmbDefaultCollectionContext } from '../default/collection-default.context.js';
import { UMB_DEFAULT_COLLECTION_CONTEXT } from '../default/collection-default.context.js';
import { html, customElement, state, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-collection-action-bundle')
export class UmbCollectionActionBundleElement extends UmbLitElement {
	#collectionContext?: UmbDefaultCollectionContext<any, any>;

	@state()
	_collectionAlias? = '';

	constructor() {
		super();

		this.consumeContext(UMB_DEFAULT_COLLECTION_CONTEXT, (context) => {
			this.#collectionContext = context;
			if (!this.#collectionContext) return;
			this._collectionAlias = this.#collectionContext.getManifest()?.alias;
		});
	}

	render() {
		return html`
			${this._collectionAlias ? html`<umb-extension-slot type="collectionAction"></umb-extension-slot>` : nothing}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-collection-action-bundle': UmbCollectionActionBundleElement;
	}
}
