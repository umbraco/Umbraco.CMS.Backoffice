import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-dashboard';
@customElement('umb-dashboard')
export class UmbDashboardElement extends UmbLitElement {
	override render() {
		return html`
			<section id="content">
				<div class="grid-container">
					<div class="medium app">App 1</div>
					<div class="medium app">App 2</div>
					<div class="small app">App 3</div>
					<div class="small app">App 4</div>
					<div class="small app">App 5</div>
					<div class="small app">App 6</div>
				</div>
			</section>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			#content {
				padding: var(--uui-size-layout-1);
			}

			.grid-container {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-template-rows: repeat(4, 150px);
				gap: var(--uui-size-layout-1);
			}

			.app {
				display: flex;
				justify-content: center;
				align-items: center;
				color: white;
				border-radius: 10px;
				padding: 10px;
				background-color: blue;
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
