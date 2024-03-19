import { UmbMediaTypeWorkspaceContext } from './media-type-workspace.context.js';
import { UmbMediaTypeWorkspaceEditorElement } from './media-type-workspace-editor.element.js';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbWorkspaceIsNewRedirectController } from '@umbraco-cms/backoffice/workspace';

@customElement('umb-media-type-workspace')
export class UmbMediaTypeWorkspaceElement extends UmbLitElement {
	#workspaceContext = new UmbMediaTypeWorkspaceContext(this);
	#createElement = () => new UmbMediaTypeWorkspaceEditorElement();

	@state()
	_routes: UmbRoute[] = [
		{
			path: 'create/parent/:entityType/:parentUnique',
			component: this.#createElement,
			setup: (_component, info) => {
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
			path: 'edit/:id',
			component: this.#createElement,
			setup: (_component, info) => {
				const id = info.match.params.id;
				this.#workspaceContext.load(id);
			},
		},
	];

	render() {
		return html`<umb-router-slot .routes=${this._routes}></umb-router-slot>`;
	}
}

export default UmbMediaTypeWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-type-workspace-': UmbMediaTypeWorkspaceElement;
	}
}
