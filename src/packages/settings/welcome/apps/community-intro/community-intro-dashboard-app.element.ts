import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-community-intro-dashboard-app';
@customElement(elementName)
export class UmbCommunityIntroDashboardAppElement extends UmbLitElement {
	override render() {
		return html`
			<uui-box headline=${this.localize.term('settingsDashboard_communityHeader')}>
				<umb-localize key="settingsDashboard_communityDescription"></umb-localize>
				<div>
					<uui-button
						look="primary"
						href="https://our.umbraco.com/forum"
						label=${this.localize.term('settingsDashboard_goForum')}
						target="_blank"
						rel="noopener"></uui-button>
					<uui-button
						look="primary"
						href="https://discord.umbraco.com"
						label=${this.localize.term('settingsDashboard_chatWithCommunity')}
						target="_blank"
						rel="noopener"></uui-button>
				</div>
			</uui-box>
		`;
	}

	static override styles = [UmbTextStyles];
}

export { UmbCommunityIntroDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCommunityIntroDashboardAppElement;
	}
}
