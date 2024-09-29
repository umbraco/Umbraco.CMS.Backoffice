import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-videos-intro-dashboard-app';
@customElement(elementName)
export class UmbVideosIntroDashboardAppElement extends UmbLitElement {
	override render() {
		return html`
			<p>
				<umb-localize key="settingsDashboard_videosDescription"></umb-localize>
			</p>
			<uui-button
				look="primary"
				href="https://www.youtube.com/c/UmbracoLearningBase"
				label=${this.localize.term('settingsDashboard_watchVideos')}
				target="_blank"
				rel="noopener"></uui-button>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			p {
				margin-top: 0;
				max-width: 300px;
			}
		`,
	];
}

export { UmbVideosIntroDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbVideosIntroDashboardAppElement;
	}
}
