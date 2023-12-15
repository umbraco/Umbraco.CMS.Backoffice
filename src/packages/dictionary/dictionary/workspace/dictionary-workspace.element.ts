import { UmbDictionaryWorkspaceContext } from './dictionary-workspace.context.js';
import { UmbDictionaryWorkspaceEditorElement } from './dictionary-workspace-editor.element.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbWorkspaceIsNewRedirectController } from '@umbraco-cms/backoffice/workspace';

@customElement('umb-dictionary-workspace')
export class UmbWorkspaceDictionaryElement extends UmbLitElement {
	#workspaceContext = new UmbDictionaryWorkspaceContext(this);
	#createElement = () => new UmbDictionaryWorkspaceEditorElement();

	@state()
	_routes: UmbRoute[] = [
		{
			path: 'edit/:id',
			component: this.#createElement,
			setup: (_component, info) => {
				const id = info.match.params.id;
				this.#workspaceContext.load(id);
			},
		},
		{
			path: 'create/:parentId',
			component: this.#createElement,
			setup: async (_component, info) => {
				const parentId = info.match.params.parentId === 'null' ? null : info.match.params.parentId;
				await this.#workspaceContext.create(parentId);

				new UmbWorkspaceIsNewRedirectController(
					this,
					this.#workspaceContext,
					this.shadowRoot!.querySelector('umb-router-slot')!,
				);
			},
		},
	];

	render() {
		return html`<umb-router-slot .routes=${this._routes}></umb-router-slot> `;
	}

	static styles = [UmbTextStyles];
}

export default UmbWorkspaceDictionaryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dictionary-workspace': UmbWorkspaceDictionaryElement;
	}
}
