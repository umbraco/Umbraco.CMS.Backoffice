import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { UUIButtonState } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { Telemetry, TelemetryLevel, TelemetryResource } from '@umbraco-cms/backend-api';
import { UmbLitElement } from '@umbraco-cms/element';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';

@customElement('umb-dashboard-telemetry')
export class UmbDashboardTelemetryElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			.italic {
				font-style: italic;
			}
		`,
	];

	@state()
	private _telemetryFormData = TelemetryLevel.BASIC;

	@state()
	private _telemetryLevels: Telemetry[] = [];

	@state()
	private _errorMessage = '';

	@state()
	private _buttonState: UUIButtonState | undefined = undefined;

	constructor() {
		super();
		this._setup();
	}

	private async _setup() {
		const telemetryLevels = await tryExecuteAndNotify(this, TelemetryResource.getTelemetry({ skip: 0, take: 3 }));
		this._telemetryLevels = telemetryLevels.data?.items ?? [];

		const telemetryLevel = await tryExecuteAndNotify(this, TelemetryResource.getTelemetryLevel());
		this._telemetryFormData = telemetryLevel.data?.telemetryLevel ?? TelemetryLevel.BASIC;
	}

	private _handleSubmit = async (e: CustomEvent<SubmitEvent>) => {
		e.stopPropagation();

		this._buttonState = 'waiting';

		const { error } = await tryExecuteAndNotify(
			this,
			TelemetryResource.postTelemetryLevel({
				requestBody: { telemetryLevel: this._telemetryFormData },
			})
		);

		if (error) {
			this._buttonState = 'failed';
			this._errorMessage = error.detail;
			return;
		}

		this._buttonState = 'success';
	};

	private _handleChange(e: InputEvent) {
		const target = e.target as HTMLInputElement;
		this._telemetryFormData = this._telemetryLevels[parseInt(target.value) - 1].telemetryLevel ?? TelemetryLevel.BASIC;
	}

	private get _selectedTelemetryIndex() {
		return this._telemetryLevels.findIndex((x) => x.telemetryLevel === this._telemetryFormData) ?? 0;
	}

	private get _selectedTelemetry() {
		return this._telemetryLevels.find((x) => x.telemetryLevel === this._telemetryFormData) ?? this._telemetryLevels[1];
	}

	private get _selectedTelemetryDescription() {
		switch (this._selectedTelemetry.telemetryLevel) {
			case TelemetryLevel.MINIMAL:
				return 'We will only send an anonymized site ID to let us know that the site exists.';
			case TelemetryLevel.BASIC:
				return 'We will send an anonymized site ID, Umbraco version, and packages installed.';
			case TelemetryLevel.DETAILED:
				return `We will send:<ul>
				<li>Anonymized site ID, Umbraco version, and packages installed.</li>
				<li>Number of: Root nodes, Content nodes, Macros, Media, Document Types, Templates, Languages, Domains, User Group, Users, Members, and Property Editors in use.</li>
				<li>System information: Webserver, server OS, server framework, server OS language, and database provider.</li>
				<li>Configuration settings: Modelsbuilder mode, if custom Umbraco path exists, ASP environment, and if you are in debug mode.</li>
				</ul>

				<i>We might change what we send on the Detailed level in the future. If so, it will be listed above.
				By choosing "Detailed" you agree to current and future anonymized information being collected.</i>`;
			default:
				return 'Could not find description for this setting';
		}
	}

	private _renderSettingSlider() {
		if (!this._telemetryLevels || this._telemetryLevels.length < 1) return;

		return html`
			<uui-slider
				@input=${this._handleChange}
				name="telemetryLevel"
				label="telemetry level"
				value=${this._selectedTelemetryIndex + 1}
				min="1"
				max=${this._telemetryLevels.length}
				hide-step-values></uui-slider>
			<h2>${this._selectedTelemetry.telemetryLevel}</h2>
			<p>${unsafeHTML(this._selectedTelemetryDescription)}</p>
		`;
	}

	render() {
		return html`
			<uui-box>
				<h1>Consent for telemetry data</h1>
				<div style="max-width:580px">
					<p>
						In order to improve Umbraco and add new functionality based on as relevant information as possible, we would
						like to collect system- and usage information from your installation. Aggregate data will be shared on a
						regular basis as well as learnings from these metrics. Hopefully, you will help us collect some valuable
						data.
						<br /><br />
						We <strong>WILL NOT</strong> collect any personal data such as content, code, user information, and all data
						will be fully anonymized.
					</p>
					${this._renderSettingSlider()}
					<uui-button
						look="primary"
						color="positive"
						label="Save telemetry settings"
						@click="${this._handleSubmit}"
						.state=${this._buttonState}>
						Save
					</uui-button>
				</div>
				${this._errorMessage ? html`<p class="error">${this._errorMessage}</p>` : ''}
			</uui-box>
		`;
	}
}

export default UmbDashboardTelemetryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-telemetry': UmbDashboardTelemetryElement;
	}
}
