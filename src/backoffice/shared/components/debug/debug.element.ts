import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbContextDebugRequest } from '@umbraco-cms/backoffice/context-api';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';
import { UMB_CONTEXT_DEBUGGER_MODAL_TOKEN } from './modals/debug';

@customElement('umb-debug')
export class UmbDebug extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				float: right;
			}

			#container {
				display: block;
				font-family: monospace;

				z-index: 10000;

				position: relative;
				width: 100%;
				padding: 10px 0;
			}

			uui-badge {
				cursor: pointer;
			}

			uui-icon {
				font-size: 15px;
			}

			.events {
				background-color: var(--uui-color-danger);
				color: var(--uui-color-selected-contrast);
				max-height: 0;
				transition: max-height 0.25s ease-out;
				overflow: hidden;
			}

			.events.open {
				max-height: 500px;
				overflow: auto;
			}

			.events > div {
				padding: 10px;
			}

			h4 {
				margin: 0;
			}
		`,
	];

	@property({ reflect: true, type: Boolean })
	visible = false;

	@property({ reflect: true, type: Boolean })
	dialog = false;

	@state()
	contextData = [{}];

	@state()
	private _debugPaneOpen = false;

	private _modalContext?: UmbModalContext;

	constructor() {
		super();
		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();

		// Dispatch it
		this.dispatchEvent(
			new UmbContextDebugRequest((contexts: Map<any, any>) => {
				// The Contexts are collected
				// When travelling up through the DOM from this element
				// to the root of <umb-app> which then uses the callback prop
				// of the this event tha has been raised to assign the contexts
				// back to this property of the WebComponent
				
				// NOTE: This is fired even if the <umb-debug> element is not visible
				// And is useful for a browser extension to insert this DOM element invisibly but still
				// get the information needed (as its passed on in an event fired from this callback after collection)

				// Dispatch an event that anyone can listen to be notified about the data
				// In our case it will be a browser extension content script that will listen for this
				// And then pass the data from the browser extension content script to the background script
				// which in turn sends it onto the browser devtools HTML panel/code
				console.log('umb debug about to emit umb:debug-contexts:data', contexts);

				// Massage the data into a simplier array of objects
				this.contextData = this._contextData(contexts);
				const data = {
					contexts: this.contextData
				};

				// NOTE: Can't send contexts data directly - browser seems to not serialize it and says its null
				// But a simple object works fine
				this.dispatchEvent(new CustomEvent('umb:debug-contexts:data', { detail: data, bubbles: true }));
			})
		);
	}

	render() {
		if (this.visible) {
			return this.dialog ? this._renderDialog() : this._renderPanel();
		} else {
			return nothing;
		}
	}

	private _toggleDebugPane() {
		this._debugPaneOpen = !this._debugPaneOpen;
	}

	private _openDialog() {
		this._modalContext?.open(UMB_CONTEXT_DEBUGGER_MODAL_TOKEN, {
			content: html`${this._renderContextAliases()}`,
		});
	}

	private _renderDialog() {
		return html` <div id="container">
			<uui-badge color="danger" look="primary" attention @click="${this._openDialog}">
				<uui-icon name="umb:bug"></uui-icon> Debug
			</uui-badge>
		</div>`;
	}

	private _renderPanel() {
		return html` <div id="container">
			<uui-button color="danger" look="primary" @click="${this._toggleDebugPane}">
				<uui-icon name="umb:bug"></uui-icon>
				Debug
			</uui-button>

			<div class="events ${this._debugPaneOpen ? 'open' : ''}">
				<div>
					<ul>
						${this._renderContextAliases()}
					</ul>
				</div>
			</div>
		</div>`;
	}

	private _contextData(contexts:Map<any, any>) {
		const contextData = [];
		for (const [alias, instance] of contexts) {

			const contextItemData = this._contextItemData(instance);
			contextData.push({ alias: alias, instance: typeof instance, data: contextItemData });					
		}

		console.log('contextData', contextData);

		return contextData;
	}

	private _contextItemData(contextInstance:any) {
		let  contextItemData = {};

		if (typeof contextInstance === 'function') {
			contextItemData = { ...contextItemData, type: 'function'};
		} else if (typeof contextInstance === 'object') {
			contextItemData = { ...contextItemData, type: 'object' };

			const methodNames = this.getClassMethodNames(contextInstance);
			if (methodNames.length) {
				contextItemData = { ...contextItemData, methods: methodNames };

				const props = [];
				for (const key in contextInstance) {
					if (key.startsWith('_')) {
						continue;
					}
	
					const value = contextInstance[key];
					if (typeof value === 'string' || typeof value === 'boolean') {
						props.push({ key: key, value: value, type: typeof value });
					} else {
						props.push({ key: key, type: typeof value });
					}
				}

				contextItemData = { ...contextItemData, properties: props };
			}
		}
		else{
			contextItemData =  {...contextItemData, type: 'primitive', value: contextInstance };
		}

		return contextItemData;
	};

	private _renderContextAliases() {
		const contextsTemplates: TemplateResult[] = [];

		this.contextData.forEach((contextData) => {
			contextsTemplates.push(
				html` <li>
					Context: <strong>${contextData.alias}</strong>
					<em>(${contextData.instance})</em>
					<ul>
						${this._renderInstance(contextData.data)}
					</ul>
				</li>`
			);
		});

		return contextsTemplates;
	}

	private _renderInstance(instance: any) {
		const instanceTemplates: TemplateResult[] = [];
		
		console.log('instance', instance);

		if(instance.type === 'function'){
			return instanceTemplates.push(html`<li>Callable Function</li>`);
		}
		else if(instance.type === 'object'){
			if(instance.methods.length){
				instanceTemplates.push(
					html`
						<li>
							<strong>Methods</strong>
							<ul>
								${instance.methods.map((methodName) => html`<li>${methodName}</li>`)}
							</ul>
						</li>
					`
				);
			}

			const props: TemplateResult[] = [];
			instance.properties.forEach((property) => {
				if (property.type === 'string') {
					props.push(html`<li>${property.key} = ${property.value}</li>`);
				} else {
					props.push(html`<li>${property.key} <em>(${property.type})</em></li>`);
				}
			});

			instanceTemplates.push(html`
				<li>
					<strong>Properties</strong>
					<ul>
						${props}
					</ul>
				</li>
			`);
		}
		else if(instance.type === 'primitive'){
			instanceTemplates.push(html`<li>Context is a primitive with value: ${instance.value}</li>`);
		}

		return instanceTemplates;
	}

	private getClassMethodNames(klass: any) {
		const isGetter = (x: any, name: string): boolean => !!(Object.getOwnPropertyDescriptor(x, name) || {}).get;
		const isFunction = (x: any, name: string): boolean => typeof x[name] === 'function';
		const deepFunctions = (x: any): any =>
			x !== Object.prototype &&
			Object.getOwnPropertyNames(x)
				.filter((name) => isGetter(x, name) || isFunction(x, name))
				.concat(deepFunctions(Object.getPrototypeOf(x)) || []);
		const distinctDeepFunctions = (klass: any) => Array.from(new Set(deepFunctions(klass)));

		const allMethods =
			typeof klass.prototype === 'undefined'
				? distinctDeepFunctions(klass)
				: Object.getOwnPropertyNames(klass.prototype);
		return allMethods.filter((name: any) => name !== 'constructor' && !name.startsWith('_'));
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-debug': UmbDebug;
	}
}
