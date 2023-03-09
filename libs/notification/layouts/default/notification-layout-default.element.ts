import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { UUITextStyles } from '@umbraco-ui/uui-css';
import type { UmbNotificationHandler } from '../..';

export interface UmbNotificationDefaultData {
	message: string;
	headline?: string;
}

@customElement('umb-notification-layout-default')
export class UmbNotificationLayoutDefaultElement extends LitElement {
	static styles = [UUITextStyles];

	@property({ attribute: false })
	notificationHandler!: UmbNotificationHandler;

	@property({ type: Object })
	data!: UmbNotificationDefaultData;

	render() {
		return html`
			<uui-toast-notification-layout id="layout" headline="${ifDefined(this.data.headline)}" class="uui-text">
				<div id="message">${this.data.message}</div>
			</uui-toast-notification-layout>
		`;
	}
}
