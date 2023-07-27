import { css, html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbSectionViewExtensionElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-packages-market-place-section-view')
export class UmbPackagesMarketPlaceSectionViewElement extends UmbLitElement implements UmbSectionViewExtensionElement {
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
				height: 100%;
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
