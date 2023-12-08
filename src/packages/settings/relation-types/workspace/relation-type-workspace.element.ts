import { UmbRelationTypeWorkspaceContext } from './relation-type-workspace.context.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbRouterSlotInitEvent, UmbRoute } from '@umbraco-cms/backoffice/router';

import './relation-type-workspace-editor.element.js';
import { UmbWorkspaceIsNewRedirectController } from '@umbraco-cms/backoffice/workspace';

/**
 * @element umb-relation-type-workspace
 * @description - Element for displaying a Relation Type Workspace
 */
@customElement('umb-relation-type-workspace')
export class UmbRelationTypeWorkspaceElement extends UmbLitElement {
	#workspaceContext = new UmbRelationTypeWorkspaceContext(this);

	#routerPath? = '';

	#element = document.createElement('umb-relation-type-workspace-editor');
	#key = '';

	@state()
	_routes: UmbRoute[] = [
		{
			path: 'create/:parentId',
			component: () => this.#element,
			setup: (_component, info) => {
				const parentId = info.match.params.parentId;
				this.#workspaceContext.createScaffold(parentId);

				new UmbWorkspaceIsNewRedirectController(
					this,
					this.#workspaceContext,
					this.shadowRoot!.querySelector('umb-router-slot')!,
				);
			},
		},
		{
			path: 'edit/:id',
			component: () => this.#element,
			setup: (_component, info) => {
				const id = info.match.params.id;
				this.#workspaceContext.load(id);
			},
		},
	];

	render() {
		return html`<umb-router-slot
			.routes=${this._routes}
			@init=${(event: UmbRouterSlotInitEvent) => {
				this.#routerPath = event.target.absoluteRouterPath;
			}}></umb-router-slot>`;
	}

	static styles = [UmbTextStyles, css``];
}

export default UmbRelationTypeWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-relation-type-workspace': UmbRelationTypeWorkspaceElement;
	}
}
