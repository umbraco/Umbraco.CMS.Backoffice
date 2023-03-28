import '@umbraco-ui/uui-css/dist/uui-css.css';
import './core/css/custom-properties.css';

import 'element-internals-polyfill';

import './core/router/router-slot.element';
import './core/notification/layouts/default';
import './core/modal/modal-element.element';

import { UUIIconRegistryEssential } from '@umbraco-ui/uui';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { AuthFlow } from './core/auth/auth-flow';
import { UmbIconStore } from './core/stores/icon/icon.store';

import type { Guard, IRoute } from '@umbraco-cms/internal/router';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { OpenAPI, RuntimeLevelModel, ServerResource } from '@umbraco-cms/backoffice/backend-api';
import { umbDebugContextEventType } from '@umbraco-cms/backoffice/context-api';

@customElement('umb-app')
export class UmbApp extends UmbLitElement {
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

	@state()
	private _routes: IRoute<any>[] = [
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

		this.provideContext('UMBRACOBASE', OpenAPI.BASE);

		this.authFlow = new AuthFlow(OpenAPI.BASE !== '' ? OpenAPI.BASE : window.location.origin, window.location.href);

		this._umbIconRegistry.attach(this);

		this._setup();
	}

	async connectedCallback() {
		super.connectedCallback();

		await this._setInitStatus();
		this._redirect();

		// Listen for the debug event from the <umb-debug> component
		this.addEventListener(umbDebugContextEventType, (event: any) => {
			// Once we got to the outter most component <umb-app>
			// we can send the event containing all the contexts
			// we have collected whilst coming up through the DOM
			// and pass it back down to the callback in
			// the <umb-debug> component that originally fired the event
			event.callback(event.instances);
		});
	}

	private async _setup() {
		window.addEventListener('auth-success', () => {
			// TODO: What happens when the user is successfully logged in - persist in user service?
			console.log('%cis logged in: ' + this.authFlow.loggedIn(), 'background: red; color: yellow; font-size: x-large');
		});

		// TODO: Handle fallthrough if no cases were hit in setInitialState() - this should mean we need to perform an authorization request
		await this.authFlow.setInitialState();

		this._iconRegistry.attach(this);
	}

	private async _setInitStatus() {
		const { data } = await tryExecuteAndNotify(this, ServerResource.getServerStatus());
		this._runtimeLevel = data?.serverStatus ?? RuntimeLevelModel.UNKNOWN;
	}

	private _redirect() {
		switch (this._runtimeLevel) {
			case RuntimeLevelModel.INSTALL:
				history.replaceState(null, '', '/install');
				break;

			case RuntimeLevelModel.UPGRADE:
				history.replaceState(null, '', '/upgrade');
				break;

			case RuntimeLevelModel.RUN: {
				const pathname =
					window.location.pathname === '/install' || window.location.pathname === '/upgrade'
						? '/'
						: window.location.href;
				history.replaceState(null, '', pathname);
				break;
			}

			default:
				throw new Error(`Unsupported runtime level: ${this._runtimeLevel}`);
		}
	}

	private _isAuthorized(): boolean {
		return import.meta.env.VITE_UMBRACO_USE_MSW === 'on' ? true : this.authFlow.loggedIn();
	}

	private _isAuthorizedGuard(redirectTo?: string): Guard {
		return () => {
			if (this._isAuthorized()) {
				return true;
			}

			// TODO: How do we preserve the redirectTo param - forward it to the login page?
			// TODO: How do we handle the case where the user is already logged in, but the session has expired?
			this.authFlow.makeAuthorizationRequest();

			// let returnPath = '/login';

			// if (redirectTo) {
			// 	returnPath += `?redirectTo=${redirectTo}`;
			// }

			// history.replaceState(null, '', returnPath);
			return false;
		};
	}

	render() {
		return html`<umb-router-slot id="router-slot" .routes=${this._routes}></umb-router-slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-app': UmbApp;
	}
}
