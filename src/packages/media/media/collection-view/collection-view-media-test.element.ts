import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, LitElement, customElement } from '@umbraco-cms/backoffice/external/lit';

@customElement('umb-collection-view-media-test')
export class UmbCollectionViewMediaTestElement extends LitElement {
	render() {
		return html`umb-collection-view-media-test`;
	}

	static styles = [UmbTextStyles, css``];
}

export default UmbCollectionViewMediaTestElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-collection-view-media-test': UmbCollectionViewMediaTestElement;
	}
}
