import { UMB_WEBHOOK_COLLECTION_ALIAS } from '../../collection/index.js';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-webhook-root-workspace')
export class UmbWebhookRootWorkspaceElement extends UmbLitElement {
	override render() {
		return html`
			<umb-body-layout main-no-padding headline=${this.localize.term('treeHeaders_webhooks')}>
				<umb-collection alias=${UMB_WEBHOOK_COLLECTION_ALIAS}></umb-collection>;
			</umb-body-layout>
		`;
	}
}

export { UmbWebhookRootWorkspaceElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'umb-webhook-root-workspace': UmbWebhookRootWorkspaceElement;
	}
}
