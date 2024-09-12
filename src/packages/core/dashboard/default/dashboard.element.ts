import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbMasonryLayoutOptions } from '@umbraco-cms/backoffice/components';

const elementName = 'umb-dashboard';
@customElement('umb-dashboard')
export class UmbDashboardElement extends UmbLitElement {
	#masonryLayoutOptions: UmbMasonryLayoutOptions = {
		gap: 20,
	};

	override render() {
		return html`
			<section id="content">
				DASHBOARD HERE
				<umb-masonry-layout .options=${this.#masonryLayoutOptions}>
					<umb-extension-with-api-slot type="dashboardApp"></umb-extension-with-api-slot>
				</umb-masonry-layout>
			</section>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			#content {
				padding: var(--uui-size-layout-1);
			}
		`,
	];
}

export { UmbDashboardElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDashboardElement;
	}
}
