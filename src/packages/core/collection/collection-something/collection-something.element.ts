import type { ManifestCollectionSomething } from './collection-something.extension.js';
import { customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbExtensionElementAndApiSlotElementBase } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-collection-something')
export class UmbCollectionSomethingElement extends UmbExtensionElementAndApiSlotElementBase<ManifestCollectionSomething> {
	getExtensionType() {
		return 'collectionSomething';
	}

	getDefaultElementName() {
		return 'umb-default-collection-something';
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-collection-something': UmbCollectionSomethingElement;
	}
}
