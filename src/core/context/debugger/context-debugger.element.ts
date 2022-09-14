import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { UmbContextAtlas } from '../context-atlas';
import { UmbContextConsumerMixin } from '../context-consumer.mixin';

import './context-debugger-json.element';

@customElement('umb-context-debugger')
export class UmbContextDebuggerElement extends UmbContextConsumerMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				position: absolute;
				width: 100vw;
				height: 100vh;
			}

			#contexts-wrapper {
				padding: 12px;
				overflow: auto;
				min-width: 300px;
				flex-grow: 1;
				flex-shrink: 0;
			}

			#app-wrapper {
				position: relative;
				display: flex;
				flex-direction: column;
				box-shadow: var(--uui-shadow-depth-3);
				width: 100%;
			}

			#menu-button {
				position: absolute;
				bottom: 12px;
				left: 12px;
				z-index: 100;
			}

			.context {
				margin-bottom: 12px;
			}
			.context-name {
				font-weight: bold;
				/* margin-bottom: 8px; */
			}
			.context-children {
				margin-left: 12px;
				display: flex;
				flex-direction: column;
				/* gap: 8px; */
			}
		`,
	];

	@state()
	private _contexts: any = [];

	@property({ type: Boolean, reflect: true })
	private show = false;

	constructor() {
		super();

		UmbContextAtlas.getAll().forEach((contextName) => {
			this.consumeContext(contextName, (context: any) => {
				const propertyDescriptors = Object.getOwnPropertyDescriptors(context);
				let subscription = null;

				this._contexts.push({
					name: contextName,
					context: context,
					subscription: subscription,
					data: [],
				});

				for (const item in propertyDescriptors) {
					if (propertyDescriptors[item].value instanceof Observable && !item.startsWith('_')) {
						subscription = propertyDescriptors[item].value.subscribe((value: any) => {
							const valueAsArray = Array.isArray(value) ? value : [value];
							this._contexts.find((x: any) => x.name === contextName).data = valueAsArray;
							this.requestUpdate('_contexts');
						});
					}
				}
			});
		});
	}

	renderContextPanel() {
		return this.show
			? html` <div id="contexts-wrapper">
					${this._contexts.map((context: any) => {
						return this.renderContext(context);
					})}
			  </div>`
			: nothing;
	}

	private _toggleContextPanel() {
		this.show = !this.show;
	}

	renderContext(context: any) {
		return html`
			<div class="context">
				<div class="context-name">${context.name}</div>
				<div class="context-children">
					${context.data.map(
						(item) => html`<umb-context-debugger-json .name=${item.name} .item=${item}></umb-context-debugger-json>`
					)}
				</div>
			</div>
		`;
	}

	render() {
		return html`
			${this.renderContextPanel()}
			<div id="app-wrapper">
				<uui-button id="menu-button" @click=${this._toggleContextPanel} label="context-panel" look="secondary">
					Context Panel
				</uui-button>
				<slot></slot>
			</div>
		`;
	}
}
