import type { UmbCollectionItemModel } from '../../../types.js';
import { UmbCollectionSomethingItemElementBase } from '../base/index.js';
import { customElement } from '@umbraco-cms/backoffice/external/lit';

const elementName = 'umb-default-collection-something-item';
@customElement(elementName)
export class UmbDefaultCollectionSomethingItemElement extends UmbCollectionSomethingItemElementBase<UmbCollectionItemModel> {}

export { UmbDefaultCollectionSomethingItemElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDefaultCollectionSomethingItemElement;
	}
}
