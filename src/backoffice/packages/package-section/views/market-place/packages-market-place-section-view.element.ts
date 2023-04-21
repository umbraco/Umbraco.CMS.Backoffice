import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('umb-packages-market-place-section-view')
export class UmbPackagesMarketPlaceSectionViewElement extends LitElement {
	

	// TODO: This URL comes from the server
	// Was previously found in 'Umbraco.Sys.ServerVariables.umbracoUrls.marketplaceUrl'
	@property()
	marketplaceUrl = 'https://marketplace.umbraco.com/?umbversion=11.1.0&style=backoffice';

	render() {
		return html` <div id="container">
			<iframe
				src="${this.marketplaceUrl}"
				title="Umbraco Marketplace"
				allowfullscreen
				allow="geolocation; autoplay; clipboard-write; encrypted-media">
			</iframe>
		</div>`;
	}
	
	static styles = [
		css`
			:host {
				height: calc(100% - var(--umb-header-layout-height));
				display: block;
			}

			#container {
				height: 100%;
				display: flex;
				align-items: stretch;
			}

			iframe {
				width: 100%;
				height: 100%;
				overflow: hidden;
				border: none;
			}
		`,
	];
}

export default UmbPackagesMarketPlaceSectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-packages-market-place-section-view': UmbPackagesMarketPlaceSectionViewElement;
	}
}
