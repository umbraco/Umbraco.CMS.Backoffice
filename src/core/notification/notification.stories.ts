import '../../backoffice/shared/components/backoffice-frame/backoffice-notification-container.element';
import '../context-api/provide/context-provider.element';
import './layouts/default';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { UmbNotificationDefaultData } from './layouts/default';
import {
	UmbNotificationColor,
	UmbNotificationOptions,
	UmbNotificationService,
	UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN,
} from '.';
import { UmbLitElement } from '@umbraco-cms/element';

export default {
	title: 'API/Notifications/Overview',
	component: 'ucp-notification-layout-default',
	decorators: [
		(story) =>
			html`<umb-context-provider key="umbNotificationService" .value=${new UmbNotificationService()}>
				${story()}
			</umb-context-provider>`,
	],
} as Meta;

@customElement('story-notification-default-example')
export class StoryNotificationDefaultExampleElement extends UmbLitElement {
	private _notificationService?: UmbNotificationService;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN, (notificationService) => {
			this._notificationService = notificationService;
		});
	}

	private _handleNotification = (color: UmbNotificationColor) => {
		const options: UmbNotificationOptions<UmbNotificationDefaultData> = {
			data: {
				headline: 'Headline',
				message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			},
		};
		this._notificationService?.peek(color, options);
	};

	render() {
		return html`
			<uui-button @click="${() => this._handleNotification('default')}" label="Default"></uui-button>
			<uui-button
				@click="${() => this._handleNotification('positive')}"
				label="Positive"
				look="primary"
				color="positive"></uui-button>
			<uui-button
				@click="${() => this._handleNotification('warning')}"
				label="Warning"
				look="primary"
				color="warning"></uui-button>
			<uui-button
				@click="${() => this._handleNotification('danger')}"
				label="Danger"
				look="primary"
				color="danger"></uui-button>

			<umb-backoffice-notification-container></umb-backoffice-notification-container>
		`;
	}
}

const Template: Story = () => html`<story-notification-default-example></story-notification-default-example>`;

export const Default = Template.bind({});
Default.parameters = {
	docs: {
		source: {
			language: 'js',
			code: `
const options: UmbNotificationOptions<UmbNotificationDefaultData> = {
  data: {
	headline: 'Headline',
	message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  }
};

this._notificationService?.peek('positive', options);
`,
		},
	},
};
