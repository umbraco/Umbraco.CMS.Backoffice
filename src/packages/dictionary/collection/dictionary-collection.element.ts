import { customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbCollectionDefaultElement } from '@umbraco-cms/backoffice/collection';

const elementName = 'umb-dictionary-collection';

@customElement(elementName)
export class UmbDictionaryCollectionElement extends UmbCollectionDefaultElement {
	protected override renderToolbar() {
		return html`
			<umb-collection-toolbar slot="header">
				<umb-collection-filter-field></umb-collection-filter-field>
			</umb-collection-toolbar>
		`;
	}
}

export { UmbDictionaryCollectionElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDictionaryCollectionElement;
	}
}
