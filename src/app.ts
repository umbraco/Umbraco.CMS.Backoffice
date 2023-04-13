import '@umbraco-ui/uui-css/dist/uui-css.css';
import './core/css/custom-properties.css';

import 'element-internals-polyfill';

import './core/router/router-slot.element';
import './core/router/variant-router-slot.element';
import './core/notification/layouts/default';
import './core/modal/modal-element.element';

import { UUIIconRegistryEssential } from '@umbraco-ui/uui';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { AuthFlow } from './core/auth/auth-flow';
import { UmbIconStore } from './core/stores/icon/icon.store';
import type { Guard, IRoute } from '@umbraco-cms/backoffice/router';
import { pathWithoutBasePath } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { OpenAPI, RuntimeLevelModel, ServerResource } from '@umbraco-cms/backoffice/backend-api';
import { contextData, umbDebugContextEventType } from '@umbraco-cms/backoffice/context-api';

@customElement('umb-app')
export class UmbAppElement extends UmbLitElement {
	static styles = css`
		:host {
			overflow: hidden;
		}

		:host,
		#router-slot {
			display: block;
			width: 100%;
			height: 100vh;
		}
	`;

	@property({ type: String })
	private serverUrl?: string;

	private _routes: IRoute[] = [
		{
			path: 'install',
			component: () => import('./installer/installer.element'),
		},
		{
			path: 'upgrade',
			component: () => import('./upgrader/upgrader.element'),
			guards: [this._isAuthorizedGuard('/upgrade')],
		},
		{
			path: '**',
			component: () => import('./backoffice/backoffice.element'),
			guards: [this._isAuthorizedGuard()],
		},
	];

	private _umbIconRegistry = new UmbIconStore();

	private _iconRegistry = new UUIIconRegistryEssential();
	private _runtimeLevel = RuntimeLevelModel.UNKNOWN;

	private authFlow: AuthFlow;

	constructor() {
		super();

		OpenAPI.BASE =
			import.meta.env.VITE_UMBRACO_USE_MSW === 'on' ? '' : this.serverUrl ?? import.meta.env.VITE_UMBRACO_API_URL ?? '';
		OpenAPI.WITH_CREDENTIALS = true;

		this.authFlow = new AuthFlow(OpenAPI.BASE !== '' ? OpenAPI.BASE : window.location.origin, window.location.href);

		this.provideContext('UMBRACOBASE', OpenAPI.BASE);

		this._setup();
	}

	async connectedCallback() {
		super.connectedCallback();

		// TODO: Handle fallthrough if no cases were hit in setInitialState() - this should mean we need to perform an authorization request
		await this.authFlow.setInitialState();

		await this._setInitStatus();
	}

	private async _setup() {
		window.addEventListener('auth-success', () => {
			// TODO: What happens when the user is successfully logged in - persist in user service?
			console.log('%cis logged in: ' + this.authFlow.loggedIn(), 'background: red; color: yellow; font-size: x-large');
		});

		this._iconRegistry.attach(this);

		// Listen for the debug event from the <umb-debug> component
		this.addEventListener(umbDebugContextEventType, (event: any) => {
			// Once we got to the outter most component <umb-app>
			// we can send the event containing all the contexts
			// we have collected whilst coming up through the DOM
			// and pass it back down to the callback in
			// the <umb-debug> component that originally fired the event
			if (event.callback) {
				event.callback(event.instances);
			}

			// Massage the data into a simplier format
			// Why? Can't send contexts data directly - browser seems to not serialize it and says its null
			// But a simple object works fine for browser extension to consume
			const data = {
				contexts: contextData(event.instances),
			};

			// Emit this new event for the browser extension to listen for
			this.dispatchEvent(new CustomEvent('umb:debug-contexts:data', { detail: data, bubbles: true }));
		});
	}

	private async _setInitStatus() {
		const { data } = await tryExecuteAndNotify(this, ServerResource.getServerStatus());
		this._runtimeLevel = data?.serverStatus ?? RuntimeLevelModel.UNKNOWN;
		this._redirect();
	}

	private _redirect() {
		switch (this._runtimeLevel) {
			case RuntimeLevelModel.INSTALL:
				history.replaceState(null, '', 'install');
				break;

			case RuntimeLevelModel.UPGRADE:
				history.replaceState(null, '', 'upgrade');
				break;

			case RuntimeLevelModel.RUN: {
				const pathname = pathWithoutBasePath({ start: true, end: false });

				// If we are on the installer or upgrade page, redirect to the root
				// but if not, keep the current path but replace state anyway to initialize the router
				const finalPath = pathname === '/install' || pathname === '/upgrade' ? '/' : location.href;

				history.replaceState(null, '', finalPath);
				break;
			}

			default:
				throw new Error(`Unsupported runtime level: ${this._runtimeLevel}`);
		}
	}

	private _isAuthorized(): boolean {
		return import.meta.env.VITE_UMBRACO_USE_MSW === 'on' ? true : this.authFlow.loggedIn();
	}

	private _isAuthorizedGuard(): Guard {
		return () => {
			if (this._isAuthorized()) {
				return true;
			}

			// TODO: How do we handle the case where the user is already logged in, but the session has expired?
			this.authFlow.makeAuthorizationRequest(undefined, window.location.href);

			return false;
		};
	}

	render() {
		return html`<umb-router-slot id="router-slot" .routes=${this._routes}></umb-router-slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-app': UmbAppElement;
	}
}
