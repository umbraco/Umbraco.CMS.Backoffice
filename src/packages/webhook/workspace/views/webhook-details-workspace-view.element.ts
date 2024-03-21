import { UMB_WEBHOOK_WORKSPACE_CONTEXT } from '../webhook-workspace.context.js';
import type { UmbWebhookDetailModel } from '../../types.js';
import type { UmbWebhookItemModel } from '../../repository/index.js';
import type { UUIToggleElement } from '@umbraco-cms/backoffice/external/uui';
import { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { css, html, nothing, customElement, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

@customElement('umb-webhook-details-workspace-view')
export class UmbWebhookDetailsWorkspaceViewElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	_webhook?: UmbWebhookDetailModel;

	@state()
	_isNew?: boolean;

	@state()
	_validationErrors?: { [key: string]: Array<any> };

	#webhookWorkspaceContext?: typeof UMB_WEBHOOK_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_WEBHOOK_WORKSPACE_CONTEXT, (instance) => {
			this.#webhookWorkspaceContext = instance;

			this.observe(this.#webhookWorkspaceContext.data, (webhook) => {
				this._webhook = webhook;
			});

			this.observe(this.#webhookWorkspaceContext.isNew, (isNew) => {
				this._isNew = isNew;
			});

			this.observe(this.#webhookWorkspaceContext.validationErrors, (value) => {
				this._validationErrors = value;
				this.requestUpdate('_validationErrors');
			});
		});
	}

	#handleEnableChange(event: UUIBooleanInputEvent) {
		if (event instanceof UUIBooleanInputEvent) {
			const target = event.composedPath()[0] as UUIToggleElement;
			this.#webhookWorkspaceContext?.setMandatory(target.checked);
		}
	}

	render() {
		return html`
			<uui-box>
				<umb-property-layout label="ID">
					<div slot="editor">${this._webhook?.unique}</div>
				</umb-property-layout>

				<umb-property-layout label="Settings">
					<div slot="editor">
						<uui-toggle
							label="Enabled"
							?checked=${this._webhook?.enabled || true}
							@change=${this.#handleEnableChange}>
						</uui-toggle>
					</div>
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

			uui-combobox {
				width: 100%;
			}

			hr {
				border: none;
				border-bottom: 1px solid var(--uui-color-divider);
			}

			.validation-message {
				color: var(--uui-color-danger);
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
