import { UMB_DATA_TYPE_FOLDER_WORKSPACE_ALIAS } from './constants.js';
import { UMB_DATA_TYPE_FOLDER_WORKSPACE_CONTEXT } from './data-type-folder.workspace.context-token.js';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

const elementName = 'umb-data-type-folder-workspace-editor';
@customElement(elementName)
export class UmbDataTypeFolderWorkspaceEditorElement extends UmbLitElement {
	@state()
	private _name = '';

	#workspaceContext?: typeof UMB_DATA_TYPE_FOLDER_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_DATA_TYPE_FOLDER_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#workspaceContext = workspaceContext;
			this.#observeName();
		});
	}

	#observeName() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.name, (name) => {
			if (name !== this._name) {
				this._name = name ?? '';
			}
		});
	}

	override render() {
		return html`<umb-workspace-editor headline=${this._name} alias=${UMB_DATA_TYPE_FOLDER_WORKSPACE_ALIAS}>
		</umb-workspace-editor>`;
	}

	static override styles = [UmbTextStyles, css``];
}

export { UmbDataTypeFolderWorkspaceEditorElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDataTypeFolderWorkspaceEditorElement;
	}
}