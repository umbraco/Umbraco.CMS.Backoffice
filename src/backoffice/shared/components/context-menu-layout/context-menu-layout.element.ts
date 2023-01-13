import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';

@customElement('umb-context-menu-layout')
export class UmbContextMenuLayout extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				width: 100%;
				height: 100%;
				flex-direction: column;
				background-color: var(--uui-color-surface);
			}

			#header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				min-height: 60px;
				box-sizing: border-box;				
				border-bottom: 1px solid var(--uui-color-border);
				padding: 0 var(--uui-size-4);
			}

			uui-scroll-container {
				padding: var(--uui-size-4);
			}

			#headline {
				margin: 0;
			}

			#tabs {
				margin-left: auto;
			}

			#main {
				display: flex;
				flex: 1;
				flex-direction: column;
			}

			#footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 54px; /* TODO: missing var(--uui-size-18);*/
				box-sizing: border-box;
			}

			#actions {
				display: flex;
				gap: 6px;
				margin: 0 var(--uui-size-layout-1);
				margin-left: auto;
			}
		`,
	];

	private hasNodes = (e: Event) => {
		return (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
	};

	/**
	 * Renders a headline in the header.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property()
	public headline = '';

	@state()
	private _footerSlotHasChildren = false;
	@state()
	private _actionsSlotHasChildren = false;

	render() {
		return html`
			<div id="header" style="display:${this.headline ? '' : 'none'}">
				${when(this.headline, () => html`<h3 id="headline">${this.headline}</h3>`)}
			</div>
			<uui-scroll-container id="main">
				<slot></slot>
			</uui-scroll-container>
			<div id="footer" style="display:${this._footerSlotHasChildren || this._actionsSlotHasChildren ? '' : 'none'}">
				<slot
					name="footer"
					@slotchange=${(e: Event) => {
						this._footerSlotHasChildren = this.hasNodes(e);
					}}></slot>
				<slot
					id="actions"
					name="actions"
					style="display:${this._actionsSlotHasChildren ? '' : 'none'}"
					@slotchange=${(e: Event) => {
						this._actionsSlotHasChildren = this.hasNodes(e);
					}}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-context-menu-layout': UmbContextMenuLayout;
	}
}
