import type { UmbSaveableWorkspaceContext } from '../../contexts/tokens/saveable-workspace-context.interface.js';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbExtensionsApiInitializer } from '@umbraco-cms/backoffice/extension-api';

@customElement('umb-editable-workspace')
export class UmbEditableWorkspaceElement extends UmbLitElement {
	@state()
	_routes: UmbRoute[] = [];

	public set api(api: UmbSaveableWorkspaceContext) {
		this.observe(api.routes.routes, (routes) => (this._routes = routes));

		new UmbExtensionsApiInitializer(this, umbExtensionsRegistry, 'workspaceContext', [api]);
	}

	render() {
		return html`<uui-form>
			<form>
				<umb-router-slot .routes="${this._routes}"></umb-router-slot>
			</form>
		</uui-form>`;
	}
}

export default UmbEditableWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editable-workspace': UmbEditableWorkspaceElement;
	}
}
