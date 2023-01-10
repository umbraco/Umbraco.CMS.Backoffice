import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import type { UUIButtonState } from '@umbraco-ui/uui';
import { UmbWorkspaceDictionaryContext } from '../dictionary-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-workspace-action-dictionary-save')
export class UmbWorkspaceActionDictionarySaveElement extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	@state()
	private _saveButtonState?: UUIButtonState;

	private _workspaceContext?: UmbWorkspaceDictionaryContext;

	constructor() {
		super();

		this.consumeContext('umbWorkspaceContext', (instance) => {
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

export default UmbWorkspaceActionDictionarySaveElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-action-dictionary-save': UmbWorkspaceActionDictionarySaveElement;
	}
}
