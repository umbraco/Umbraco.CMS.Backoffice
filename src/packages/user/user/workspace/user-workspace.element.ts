import { UmbUserWorkspaceContext } from './user-workspace.context.js';
import { UmbUserWorkspaceEditorElement } from './user-workspace-editor.element.js';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';

@customElement('umb-user-workspace')
export class UmbUserWorkspaceElement extends UmbLitElement {
	#workspaceContext = new UmbUserWorkspaceContext(this);
	#createElement = () => new UmbUserWorkspaceEditorElement();

	@state()
	_routes: UmbRoute[] = [
		{
			path: ':id',
			component: this.#createElement,
			setup: (component, info) => {
				const id = info.match.params.id;
				this.#workspaceContext.load(id);
			},
		},
	];

	render() {
		return html`<umb-router-slot .routes=${this._routes}></umb-router-slot> `;
	}

	static styles = [UmbTextStyles];
}

export default UmbUserWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-workspace': UmbUserWorkspaceElement;
	}
}
