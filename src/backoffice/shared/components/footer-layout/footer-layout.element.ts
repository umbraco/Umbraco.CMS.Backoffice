import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';

/**
 * @element umb-footer-layout
 * @description
 * @slot default - Slot footer items
 * @slot actions - Slot actions
 * @export
 * @class UmbFooterLayout
 * @extends {UmbLitElement}
 */
@customElement('umb-footer-layout')
export class UmbFooterLayout extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 54px; /* TODO: missing var(--uui-size-18);*/
				border-top: 1px solid var(--uui-color-border);
				background-color: var(--uui-color-surface);
				box-sizing: border-box;
			}

			#actions {
				display: flex;
				gap: var(--uui-size-space-2);
				margin: 0 var(--uui-size-layout-1);
				margin-left: auto;
			}
		`,
	];

	@state()
	private _footerSlotHasChildren = false;

	@state()
	private _actionsSlotHasChildren = false;

	#hasNodes = (e: Event) => {
		return (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
	};

	#updateDisplay() {
		this.style.display = this._footerSlotHasChildren || this._actionsSlotHasChildren ? '' : 'none';
	}

	render() {
		return html`
			<slot
				@slotchange=${(e: Event) => {
					this._footerSlotHasChildren = this.#hasNodes(e);
					this.#updateDisplay();
				}}></slot>
			<slot
				id="actions"
				name="actions"
				style="display:${this._actionsSlotHasChildren ? '' : 'none'}"
				@slotchange=${(e: Event) => {
					this._actionsSlotHasChildren = this.#hasNodes(e);
					this.#updateDisplay();
				}}></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-footer-layout': UmbFooterLayout;
	}
}
