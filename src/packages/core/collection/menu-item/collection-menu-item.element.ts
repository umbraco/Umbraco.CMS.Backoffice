import type { ManifestMenuItemCollectionKind } from '../collection-something/types.js';
import { html, customElement, property, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbMenuItemElement } from '@umbraco-cms/backoffice/menu';

const elementName = 'umb-collection-menu-item';
@customElement(elementName)
export class UmbCollectionMenuItemElement extends UmbLitElement implements UmbMenuItemElement {
	@property({ type: Object })
	manifest?: ManifestMenuItemCollectionKind;

	override render() {
		return this.manifest
			? html`
					<umb-collection-something
						alias=${this.manifest?.meta.collectionSomethingAlias}
						.props=${{
							hideRoot: this.manifest?.meta.hideRoot === true,
							selectionConfiguration: {
								selectable: false,
								multiple: false,
							},
						}}></umb-collection-something>
				`
			: nothing;
	}
}

export { elementName as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCollectionMenuItemElement;
	}
}
