import type { UmbInputWebhookHeadersElement } from '../../../components/input-webhook-headers.element.js';
import { UMB_WEBHOOK_WORKSPACE_CONTEXT } from '../webhook-workspace.context-token.js';
import type { UmbInputWebhookEventsElement } from '../../../components/input-webhook-events.element.js';
import { css, html, customElement, state, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import '@umbraco-cms/backoffice/culture';
import type { UmbWebhookDetailModel } from '@umbraco-cms/backoffice/webhook';

import type { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { UmbInputDocumentTypeElement } from '@umbraco-cms/backoffice/document-type';
import type { UUIBooleanInputEvent, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

import '../../../components/input-webhook-headers.element.js';
import '../../../components/input-webhook-events.element.js';

@customElement('umb-webhook-details-workspace-view')
export class UmbWebhookDetailsWorkspaceViewElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	_webhook?: UmbWebhookDetailModel;

	@state()
	_isNew?: boolean;

	@state()
	contentType?: string;

	#webhookWorkspaceContext?: typeof UMB_WEBHOOK_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_WEBHOOK_WORKSPACE_CONTEXT, (instance) => {
			this.#webhookWorkspaceContext = instance;
			this.observe(this.#webhookWorkspaceContext.data, (webhook) => {
				this._webhook = webhook;
				this.contentType = this._webhook?.events[0]?.eventType ?? undefined;
			});
			this.observe(this.#webhookWorkspaceContext.isNew, (isNew) => {
				this._isNew = isNew;
			});
		});
	}

	#onEventsChange(event: UmbChangeEvent) {
		const events = (event.target as UmbInputWebhookEventsElement).events;
		if (events[0].eventType !== this.contentType) {
			this.#webhookWorkspaceContext?.setTypes([]);
		}
		this.#webhookWorkspaceContext?.setEvents(events);
	}

	#onHeadersChange(event: UmbChangeEvent) {
		const headers = (event.target as UmbInputWebhookHeadersElement).headers;
		this.#webhookWorkspaceContext?.setHeaders(headers);
	}

	#onTypesChange(event: UmbChangeEvent) {
		const types = (event.target as UmbInputDocumentTypeElement).selection;
		this.#webhookWorkspaceContext?.setTypes(types);
	}

	#onUrlChange(event: UUIInputEvent) {
		const value = event.target.value;
		if (typeof value !== 'string') return;

		this.#webhookWorkspaceContext?.setUrl(value);
	}

	#onEnabledChange(event: UUIBooleanInputEvent) {
		this.#webhookWorkspaceContext?.setEnabled(event.target.checked);
	}
	#renderContentTypePicker() {
		if (this.contentType !== 'Content' && this.contentType !== 'Media') return nothing;

		return html`
			<umb-property-layout label="Content Type" description="Only trigger the webhook for a specific content type.">
				${this.#renderContentTypePickerEditor()}
			</umb-property-layout>
		`;
	}

	#renderContentTypePickerEditor() {
		switch (this.contentType) {
			case 'Content':
				return html`<umb-input-document-type
					@change=${this.#onTypesChange}
					.selection=${this._webhook?.contentTypes ?? []}
					slot="editor"
					?elementTypesOnly=${true}></umb-input-document-type>`;
			case 'Media':
				return html`<umb-input-media-type
					@change=${this.#onTypesChange}
					.selection=${this._webhook?.contentTypes ?? []}
					slot="editor"
					?elementTypesOnly=${true}></umb-input-media-type>`;
			default:
				return nothing;
		}
	}

	render() {
		if (!this._webhook) return nothing;

		return html`
			<uui-box>
				<umb-property-layout label="Url" description="The url to call when the webhook is triggered.">
					<uui-input @input=${this.#onUrlChange} .value=${this._webhook.url} slot="editor"></uui-input>
				</umb-property-layout>
				<umb-property-layout label="Events" description="The events for which the webhook should be triggered.">
					<umb-input-webhook-events
						@change=${this.#onEventsChange}
						.events=${this._webhook.events ?? []}
						slot="editor"></umb-input-webhook-events>
				</umb-property-layout>
				${this.#renderContentTypePicker()}
				<umb-property-layout label="Enabled" description="Is the webhook enabled?">
					<uui-toggle slot="editor" .checked=${this._webhook.enabled} @input=${this.#onEnabledChange}></uui-toggle>
				</umb-property-layout>
				<umb-property-layout label="Headers" description="Custom headers to include in the webhook request.">
					<umb-input-webhook-headers
						@change=${this.#onHeadersChange}
						.headers=${this._webhook.headers}
						slot="editor"></umb-input-webhook-headers>
				</umb-property-layout>
			</uui-box>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding: var(--uui-size-space-6);
			}

			uui-input {
				width: 100%;
			}

			umb-property-layout:first-child {
				padding-top: 0;
			}
			umb-property-layout:last-child {
				padding-bottom: 0;
			}
		`,
	];
}

export default UmbWebhookDetailsWorkspaceViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-webhook-details-workspace-view': UmbWebhookDetailsWorkspaceViewElement;
	}
}
