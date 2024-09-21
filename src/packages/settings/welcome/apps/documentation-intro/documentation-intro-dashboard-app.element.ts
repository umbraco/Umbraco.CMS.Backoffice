import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-documentation-intro-dashboard-app';
@customElement(elementName)
export class UmbDocumentationIntroDashboardAppElement extends UmbLitElement {
	override render() {
		return html`
			<uui-box headline=${this.localize.term('settingsDashboard_documentationHeader')}>
				<umb-localize key="settingsDashboard_documentationDescription"></umb-localize>
				<div>
					<uui-button
						look="primary"
						href="https://docs.umbraco.com/umbraco-cms/umbraco-cms"
						label=${this.localize.term('settingsDashboard_getHelp')}
						target="_blank"
						rel="noopener"></uui-button>
				</div>
			</uui-box>
		`;
	}

	static override styles = [UmbTextStyles];
}

export { UmbDocumentationIntroDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDocumentationIntroDashboardAppElement;
	}
}
