import { customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbCollectionDefaultElement } from '@umbraco-cms/backoffice/collection';

const elementName = 'umb-relation-type-collection';

@customElement(elementName)
export class UmbRelationTypeCollectionElement extends UmbCollectionDefaultElement {
	// NOTE: Returns empty toolbar, so to remove the header padding.
	protected override renderToolbar() {
		return html``;
	}
}

/** @deprecated Should be exported as `element` only; to be removed in Umbraco 17. */
export default UmbRelationTypeCollectionElement;

export { UmbRelationTypeCollectionElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbRelationTypeCollectionElement;
	}
}
