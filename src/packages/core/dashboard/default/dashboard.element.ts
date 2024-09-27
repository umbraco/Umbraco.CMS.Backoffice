import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, nothing, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbExtensionElementInitializer } from '@umbraco-cms/backoffice/extension-api';
import type { ManifestDashboardApp } from '@umbraco-cms/backoffice/extension-registry';

const elementName = 'umb-dashboard';
@customElement('umb-dashboard')
export class UmbDashboardElement extends UmbLitElement {
	#defaultSize = 'small';

	#sizeMap = new Map([
		['small', 'small'],
		['medium', 'medium'],
		['large', 'large'],
	]);

	override render() {
		return html`
			<section id="content">
				<umb-extension-slot
					type="dashboardApp"
					.renderMethod=${this.#extensionSlotRenderMethod}
					class="grid-container"></umb-extension-slot>
			</section>
		`;
	}

	#extensionSlotRenderMethod = (ext: UmbExtensionElementInitializer<ManifestDashboardApp>) => {
		if (ext.component && ext.manifest) {
			const sizeClass = this.#sizeMap.get(ext.manifest.meta?.size) ?? this.#defaultSize;
			const headline = ext.manifest?.meta?.headline ? this.localize.string(ext.manifest?.meta?.headline) : undefined;
			return html`<uui-box headline=${ifDefined(headline)} class=${sizeClass}>${ext.component}</uui-box>`;
		}

		return nothing;
	};

	static override styles = [
		UmbTextStyles,
		css`
			#content {
				padding: var(--uui-size-layout-1);
			}

			.grid-container {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-template-rows: repeat(1, 225px);
				gap: var(--uui-size-layout-1);
			}

			.small {
				grid-column: span 1;
				grid-row: span 1;
			}

			.medium {
				grid-column: span 2;
				grid-row: span 2;
			}

			.large {
				grid-column: span 2;
				grid-row: span 8;
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
