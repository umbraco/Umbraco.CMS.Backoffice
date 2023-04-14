import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { UmbUserStore, UMB_USER_STORE_CONTEXT_TOKEN } from '../repository/user.store';
import type { IRoute } from '@umbraco-cms/backoffice/router';
import { umbExtensionsRegistry, createExtensionElement } from '@umbraco-cms/backoffice/extensions-api';

import '../collection/views/table/user-table-collection-view.element';
import '../collection/views/grid/user-grid-collection-view.element';
import '../users/workspace-view-users-selection.element';

import type { UserDetails } from '@umbraco-cms/backoffice/models';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { DeepState } from '@umbraco-cms/backoffice/observable-api';
import type { ManifestWorkspace } from '@umbraco-cms/backoffice/extensions-registry';

@customElement('umb-section-view-users')
export class UmbSectionViewUsersElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				height: 100%;
			}

			#router-slot {
				height: calc(100% - var(--umb-header-layout-height));
			}
		`,
	];

	@state()
	private _routes: IRoute[] = [];

	private _workspaces: Array<ManifestWorkspace> = [];

	// TODO: This must be turned into context api: Maybe its a Collection View (SectionView Collection View)?
	private _userStore?: UmbUserStore;

	#selection = new DeepState(<Array<string>>[]);
	public readonly selection = this.#selection.asObservable();

	#users = new DeepState(<Array<UserDetails>>[]);
	public readonly users = this.#users.asObservable();

	#search = new DeepState('');
	public readonly search = this.#search.asObservable();

	constructor() {
		super();

		this.consumeContext<UmbUserStore>(UMB_USER_STORE_CONTEXT_TOKEN, (_instance) => {
			this._userStore = _instance;
			this._observeUsers();
		});

		// TODO: consider this context name, is it to broad?
		// TODO: Stop using it self as a context api.
		this.provideContext('umbUsersContext', this);

		this.observe(umbExtensionsRegistry?.extensionsOfType('workspace'), (workspaceExtensions) => {
			this._workspaces = workspaceExtensions;
			this._createRoutes();
		});
	}

	//TODO: Kun routes her. Liste logik skal rykkes til overview elementet.

	private _createRoutes() {
		const routes: IRoute[] = [
			{
				path: 'collection',
				component: () => import('../collection/user-collection.element'),
			},
			{
				path: 'user',
				component: () => import('../workspace/user-workspace.element'),
			},
		];

		routes.push({
			path: '**',
			redirectTo: 'collection',
		});
		this._routes = routes;
	}

	private _observeUsers() {
		if (!this._userStore) return;

		if (this.#search.getValue()) {
			this.observe(this._userStore.getByName(this.#search.getValue()), (users) => this.#users.next(users));
		} else {
			this.observe(this._userStore.getAll(), (users) => this.#users.next(users));
		}
	}

	public setSearch(value?: string) {
		this.#search.next(value || '');
		this._observeUsers();
		this.requestUpdate('search');
	}

	public setSelection(value: Array<string>) {
		if (!value) return;
		this.#selection.next(value);
		this.requestUpdate('selection');
	}

	public select(id: string) {
		const oldSelection = this.#selection.getValue();
		if (oldSelection.indexOf(id) !== -1) return;

		this.#selection.next([...oldSelection, id]);
		this.requestUpdate('selection');
	}

	public deselect(id: string) {
		const selection = this.#selection.getValue();
		this.#selection.next(selection.filter((k) => k !== id));
		this.requestUpdate('selection');
	}

	render() {
		return html`<umb-router-slot id="router-slot" .routes=${this._routes}></umb-router-slot>`;
	}
}

export default UmbSectionViewUsersElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-section-view-users': UmbSectionViewUsersElement;
	}
}
