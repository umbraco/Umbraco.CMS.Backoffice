import { css, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css';
import { UmbModalLayoutElement } from '@umbraco-cms/modal';

export interface UmbDebugModalData {
	content: TemplateResult | string;
}

@customElement('umb-debug-modal-layout')
export default class UmbDebugModalLayout extends UmbModalLayoutElement<UmbDebugModalData> {
	static styles = [
		UUITextStyles,
		css`
			uui-dialog-layout {
				display: flex;
				flex-direction: column;
				height: 100%;

				padding: var(--uui-size-space-5);
				box-sizing: border-box;
			}

			uui-scroll-container {
				overflow-y: scroll;
				max-height: 100%;
				min-height: 0;
				flex: 1;
			}

			uui-icon {
				vertical-align: text-top;
				color: var(--uui-color-danger);
			}

			.context {
				padding: 15px 0;
				border-bottom: 1px solid var(--uui-color-danger-emphasis);
			}

			h3 {
				margin-top: 0;
				margin-bottom: 0;
			}

			h3 > span {
				border-radius: var(--uui-size-4);
				background-color: var(--uui-color-danger);
				color: var(--uui-color-danger-contrast);
				padding: 8px;
				font-size: 12px;
			}

			ul {
				margin-top: 0;
			}
		`,
	];

	private _handleClose() {
		this.modalHandler?.close();
	}

	render() {
		return html`
			<uui-dialog-layout>
				<span slot="headline"> <uui-icon name="umb:bug"></uui-icon> Debug: Contexts </span>
				<uui-scroll-container id="field-settings"> ${this.data?.content} </uui-scroll-container>
				<uui-button slot="actions" look="primary" label="Close sidebar" @click="${this._handleClose}">Close</uui-button>
			</uui-dialog-layout>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-debug-modal-layout': UmbDebugModalLayout;
	}
}
