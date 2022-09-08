import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { UmbContextAtlas } from './context-atlas';
import { UmbContextConsumerMixin } from './context-consumer.mixin';

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
				width: 300px;
				padding: 12px;
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

			.context-name {
				font-weight: bold;
			}
			.context-children {
				margin-left: 12px;
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
			<div class="context-name">${context.name}</div>
			<div class="context-children">
				${context.data.map(
					(item) => html` <div @click=${() => console.log('Item: ', item)}>${item.name ? item.name : item}</div> `
				)}
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
