import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-support-intro-dashboard-app';
@customElement(elementName)
export class UmbSupportIntroDashboardAppElement extends UmbLitElement {
	override render() {
		return html`
			<uui-box headline=${this.localize.term('settingsDashboard_supportHeader')}>
				<p>
					<umb-localize key="settingsDashboard_supportDescription"></umb-localize>
				</p>
				<uui-button
					look="primary"
					href="https://umbraco.com/support/"
					label=${this.localize.term('settingsDashboard_getHelp')}
					target="_blank"
					rel="noopener"></uui-button>
			</uui-box>
		`;
	}

	static override styles = [UmbTextStyles];
}

export { UmbSupportIntroDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbSupportIntroDashboardAppElement;
	}
}
