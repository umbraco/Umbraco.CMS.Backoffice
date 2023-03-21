import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbWorkspaceDocumentTypeContext } from './document-type-workspace.context';
import { UmbDocumentTypeWorkspaceEditElement } from './document-type-workspace-edit.element';
import { IRoutingInfo } from '@umbraco-cms/router';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-document-type-workspace')
export class UmbDocumentTypeWorkspaceElement extends UmbLitElement {
	static styles = [UUITextStyles];

	#workspaceContext = new UmbWorkspaceDocumentTypeContext(this);
	#element = new UmbDocumentTypeWorkspaceEditElement();

	@state()
	_routes = [
		{
			path: 'edit/:key',
			component: () => this.#element,
			setup: (component: HTMLElement, info: IRoutingInfo) => {
				const key = info.match.params.key;
				this.#workspaceContext.load(key);
			},
		},
	];

	render() {
		return html` <umb-router-slot .routes=${this._routes}></umb-router-slot> `;
	}
}

export default UmbDocumentTypeWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-type-workspace': UmbDocumentTypeWorkspaceElement;
	}
}
