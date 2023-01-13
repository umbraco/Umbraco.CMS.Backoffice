import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('umb-dashboard-settings-welcome')
export class UmbDashboardSettingsWelcomeElement extends LitElement {
	static styles = [UUITextStyles, css`
		#settings-dashboard {
			display: grid;
			grid-gap:var(--uui-size-7);
			grid-template-columns: repeat(3, 1fr);
		}

		@media(max-width: 1200px) {
			#settings-dashboard {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media(max-width: 800px) {
			#settings-dashboard {
				grid-template-columns: repeat(1, 1fr);
			}
		}
	`];

	render() {
		return html`
			<div id="settings-dashboard">
				<uui-box>
					<h1>Documentation</h1>
					<p>Read more about working with the items in Settings in our Documentation.</p>
					<uui-button look="primary" href="https://docs.umbraco.com/umbraco-cms/umbraco-cms" target="_blank" rel="noopener">Get the help you need</uui-button>
				</uui-box>

				<uui-box>
					<h1>Community</h1>
					<p>Ask a question in the community forum or our Discord community</p>
					<uui-button look="primary" href="https://our.umbraco.com/forum" target="_blank" rel="noopener">Go to the forum</uui-button>
					<uui-button look="primary" href="https://discord.umbraco.com" target="_blank" rel="noopener">Chat with the community</uui-button>
				</uui-box>

				<uui-box class="training">
					<h1>Training</h1>
					<p>Find out about real-life training and certification opportunities</p>
					<uui-button look="primary" href="https://umbraco.com/training/" target="_blank" rel="noopener">Get Certified</uui-button>
				</uui-box>

				<uui-box>
					<h1>Support</h1>
					<p>Ask a question in the community forum or our Discord community.</p>
					<uui-button look="primary" href="https://umbraco.com/support/" target="_blank" rel="noopener">Get the help you need</uui-button>
				</uui-box>

				<uui-box>
					<h1>Videos</h1>
					<p>Watch our free tutorial videos on the Umbraco Learning Base YouTube channel, to get upto speed quickly with Umbraco.</p>
					<uui-button look="primary" href="https://www.youtube.com/c/UmbracoLearningBase" target="_blank" rel="noopener">Watch the videos</uui-button>
				</uui-box>
			</div>

		`;
	}
}

export default UmbDashboardSettingsWelcomeElement;
declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-settings-welcome': UmbDashboardSettingsWelcomeElement;
	}
}
