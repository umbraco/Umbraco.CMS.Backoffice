import { UMB_USER_WORKSPACE_CONTEXT } from '../../../user/workspace/user-workspace.context-token.js';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { UUIButtonState } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
// TODO: Revisit this component, it can be made via a kind with api instead. [NL]
@customElement('umb-workspace-action-user-group-save')
export class UmbWorkspaceActionUserGroupSaveElement extends UmbLitElement {
	@state()
	private _saveButtonState?: UUIButtonState;

	private _workspaceContext?: typeof UMB_USER_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_USER_WORKSPACE_CONTEXT, (instance) => {
			this._workspaceContext = instance;
		});
	}

	private async _handleSave() {
		if (!this._workspaceContext) return;

		this._saveButtonState = 'waiting';
		await this._workspaceContext
			.save()
			.then(() => {
				this._saveButtonState = 'success';
			})
			.catch(() => {
				this._saveButtonState = 'failed';
			});
	}

	render() {
		return html`<uui-button
			@click=${this._handleSave}
			look="primary"
			color="positive"
			label="save"
			.state="${this._saveButtonState}"></uui-button>`;
	}
}

export default UmbWorkspaceActionUserGroupSaveElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-action-user-group-save': UmbWorkspaceActionUserGroupSaveElement;
	}
}
