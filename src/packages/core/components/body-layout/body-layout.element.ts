import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import {
	css,
	html,
	LitElement,
	nothing,
	customElement,
	property,
	state,
	query,
} from '@umbraco-cms/backoffice/external/lit';

//TODO: Add the following attributes to JSDocs: header-transparent, main-no-padding, header-no-padding, header-fit-height

/**
 * @element umb-body-layout
 * @description Layout element to arrange elements in a body layout. A general layout for most views.
 * @slot - Slot for main content
 * @slot icon - Slot for icon
 * @slot name - Slot for name
 * @slot footer - Slot for footer element
 * @slot footer-info - Slot for info in the footer
 * @slot actions - Slot for actions in the footer
 * @slot default - slot for main content
 * @export
 * @class UmbBodyLayout
 * @extends {UmbLitElement}
 */
@customElement('umb-body-layout')
export class UmbBodyLayoutElement extends LitElement {
	@query('#main')
	private _scrollContainer?: HTMLElement;

	@property()
	public headline = '';

	@property({ type: Boolean, reflect: true, attribute: 'header-transparent' })
	public headerTransparent = false;

	@state()
	private _headerSlotHasChildren = false;

	@state()
	private _navigationSlotHasChildren = false;

	@state()
	private _actionsMenuSlotHasChildren = false;

	@state()
	private _footerSlotHasChildren = false;

	@state()
	private _actionsSlotHasChildren = false;

	#hasNodes = (e: Event) => {
		return (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
	};

	connectedCallback(): void {
		super.connectedCallback();
		if (this.headerTransparent) {
			requestAnimationFrame(() => {
				this._scrollContainer?.addEventListener('scroll', this.#onScroll);
			});
		}
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this._scrollContainer?.removeEventListener('scroll', this.#onScroll);
	}

	#onScroll = () => {
		if (!this._scrollContainer) return;
		this.toggleAttribute('scrolling', this._scrollContainer.scrollTop > 0);
	};

	render() {
		return html`
			<div
				id="header"
				style="display: ${this.headline ||
				this._headerSlotHasChildren ||
				this._actionsMenuSlotHasChildren ||
				this._navigationSlotHasChildren
					? ''
					: 'none'}">
				${this.headline ? html`<h3 id="headline">${this.headline}</h3>` : nothing}

				<slot
					id="header-slot"
					name="header"
					@slotchange=${(e: Event) => {
						this._headerSlotHasChildren = this.#hasNodes(e);
					}}></slot>
				<slot
					id="navigation-slot"
					name="navigation"
					@slotchange=${(e: Event) => {
						this._actionsMenuSlotHasChildren = this.#hasNodes(e);
					}}></slot>
				<slot
					id="action-menu-slot"
					name="action-menu"
					@slotchange=${(e: Event) => {
						this._actionsMenuSlotHasChildren = this.#hasNodes(e);
					}}></slot>
			</div>

			<!-- This div should be changed for the uui-scroll-container when it gets updated -->
			<div id="main">
				<slot></slot>
			</div>

			<slot name="footer"></slot>
			<umb-footer-layout style="display:${this._footerSlotHasChildren || this._actionsSlotHasChildren ? '' : 'none'}">
				<slot
					name="footer-info"
					@slotchange=${(e: Event) => {
						this._footerSlotHasChildren = this.#hasNodes(e);
					}}></slot>
				<slot
					name="actions"
					slot="actions"
					@slotchange=${(e: Event) => {
						this._actionsSlotHasChildren = this.#hasNodes(e);
					}}></slot>
			</umb-footer-layout>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				background-color: var(--uui-color-background);
				width: 100%;
				height: 100%;
				flex-direction: column;
			}

			#header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: var(--umb-header-layout-height);
				background-color: var(--uui-color-surface);
				border-bottom: 1px solid var(--uui-color-border);
				box-sizing: border-box;
				z-index: 1;
			}
			:host([header-transparent]) #header {
				background-color: transparent;
				border-color: transparent;
				transition: box-shadow 150ms ease-in-out;
				box-shadow: 0 -1px 0px 0px rgba(0, 0, 0, 0.5);
			}
			:host([header-transparent][scrolling]) #header {
				/* This should be using the uui-shadows but for now they are too drastic for this use case */
				box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.2);
			}
			:host([header-fit-height][header-transparent]:not([header-no-padding])) #header-slot {
				padding: var(--uui-size-layout-1);
			}
			:host([header-fit-height]) #header {
				height: fit-content;
			}
			#header-slot {
				padding: 0 var(--uui-size-layout-1);
				flex-grow: 1;
			}
			:host([header-no-padding]) #header-slot {
				padding: 0;
			}

			:host([header-transparent]:not([main-no-padding])) #main:not(*[style='display: none'] + *) {
				/* The following styling is only applied if the clear-header IS present,
				the main-no-padding attribute is NOT present, and the header is NOT hidden */
				padding-top: var(--uui-size-space-1);
			}
			:host([main-no-padding]) #main {
				padding: 0;
			}

			#header-slot,
			#tabs-slot,
			#action-menu-slot,
			#navigation-slot {
				display: flex;
				height: 100%;
				align-items: center;
				box-sizing: border-box;
				min-width: 0;
			}

			#navigation-slot,
			#tabs-slot {
				margin-left: auto;
			}

			#headline {
				display: block;
				margin: 0 var(--uui-size-layout-1);
			}

			#main {
				display: block;
				flex: 1;
				flex-direction: column;
				overflow-y: auto;
				padding: var(--uui-size-layout-1);
			}

			#main > slot::slotted(*:first-child) {
				padding-top: 0;
				margin-top: 0;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-body-layout': UmbBodyLayoutElement;
	}
}
