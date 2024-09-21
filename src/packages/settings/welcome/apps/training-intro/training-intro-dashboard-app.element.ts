import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-training-intro-dashboard-app';
@customElement(elementName)
export class UmbTrainingIntroDashboardAppElement extends UmbLitElement {
	override render() {
		return html`
			<uui-box headline=${this.localize.term('settingsDashboard_trainingHeader')}>
				<p>
					<umb-localize key="settingsDashboard_trainingDescription"></umb-localize>
				</p>
				<uui-button
					look="primary"
					href="https://umbraco.com/training/"
					label=${this.localize.term('settingsDashboard_getCertified')}
					target="_blank"
					rel="noopener"></uui-button>
			</uui-box>
		`;
	}

	static override styles = [UmbTextStyles];
}

export { UmbTrainingIntroDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbTrainingIntroDashboardAppElement;
	}
}
