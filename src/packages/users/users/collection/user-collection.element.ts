import { UmbUserCollectionContext } from './user-collection.context.js';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { UMB_COLLECTION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/collection';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';

import './user-collection-header.element.js';

export type UsersViewType = 'list' | 'grid';
@customElement('umb-user-collection')
export class UmbUserCollectionElement extends UmbLitElement {
	#collectionContext = new UmbUserCollectionContext(this);

	@state()
	private _routes: UmbRoute[] = [
		{
			path: 'grid',
			component: () => import('./views/grid/user-collection-grid-view.element.js'),
		},
		{
			path: 'list',
			component: () => import('./views/table/user-collection-table-view.element.js'),
		},
		{
			path: '',
			redirectTo: 'grid',
		},
	];

	connectedCallback(): void {
		super.connectedCallback();
		this.provideContext(UMB_COLLECTION_CONTEXT_TOKEN, this.#collectionContext);
	}

	render() {
		return html`
			<umb-body-layout header-transparent>
				<umb-user-collection-header slot="header"></umb-user-collection-header>
				<umb-router-slot id="router-slot" .routes=${this._routes}></umb-router-slot>
				<umb-collection-selection-actions slot="footer"></umb-collection-selection-actions>
			</umb-body-layout>
			<!-- This should go in the footer slot -->
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		`,
	];
}

export default UmbUserCollectionElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-collection': UmbUserCollectionElement;
	}
}
