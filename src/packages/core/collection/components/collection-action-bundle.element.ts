import { css, customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-collection-action-bundle';

@customElement(elementName)
export class UmbCollectionActionBundleElement extends UmbLitElement {
	override render() {
		return html`<umb-extension-slot type="collectionAction"></umb-extension-slot>`;
	}

	static override readonly styles = [
		css`
			:host {
				display: contents;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCollectionActionBundleElement;
	}
}
