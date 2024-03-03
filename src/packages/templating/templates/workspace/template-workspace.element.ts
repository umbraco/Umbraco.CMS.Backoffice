import { UmbTemplateWorkspaceContext } from './template-workspace.context.js';
import { UmbTemplateWorkspaceEditorElement } from './template-workspace-editor.element.js';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { IRoutingInfo, PageComponent, UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

import '../../components/templating-item-menu/templating-item-menu.element.js';
import { UmbWorkspaceIsNewRedirectController } from '@umbraco-cms/backoffice/workspace';

@customElement('umb-template-workspace')
export class UmbTemplateWorkspaceElement extends UmbLitElement {
	#workspaceContext = new UmbTemplateWorkspaceContext(this);
	#createElement = () => new UmbTemplateWorkspaceEditorElement();

	@state()
	_routes: UmbRoute[] = [
		{
			path: 'create/parent/:entityType/:parentUnique',
			component: this.#createElement,
			setup: (component: PageComponent, info: IRoutingInfo) => {
				const parentEntityType = info.match.params.entityType;
				const parentUnique = info.match.params.parentUnique === 'null' ? null : info.match.params.parentUnique;
				this.#workspaceContext.create({ entityType: parentEntityType, unique: parentUnique });

				new UmbWorkspaceIsNewRedirectController(
					this,
					this.#workspaceContext,
					this.shadowRoot!.querySelector('umb-router-slot')!,
				);
			},
		},
		{
			path: 'edit/:unique',
			component: this.#createElement,
			setup: (component: PageComponent, info: IRoutingInfo): void => {
				const unique = info.match.params.unique;
				this.#workspaceContext.load(unique);
			},
		},
	];

	render() {
		return html`<umb-router-slot .routes=${this._routes}></umb-router-slot>`;
	}
}

export default UmbTemplateWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-template-workspace': UmbTemplateWorkspaceElement;
	}
}
