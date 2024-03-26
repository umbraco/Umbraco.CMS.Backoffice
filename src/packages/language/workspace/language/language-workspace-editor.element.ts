import type { UmbLanguageDetailModel } from '../../types.js';
import { UMB_LANGUAGE_WORKSPACE_CONTEXT } from './language-workspace.context-token.js';
import type { UUIInputElement } from '@umbraco-cms/backoffice/external/uui';
import { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
@customElement('umb-language-workspace-editor')
export class UmbLanguageWorkspaceEditorElement extends UmbLitElement {
	#workspaceContext?: typeof UMB_LANGUAGE_WORKSPACE_CONTEXT.TYPE;

	@state()
	_language?: UmbLanguageDetailModel;

	@state()
	_isNew?: boolean;

	constructor() {
		super();

		this.consumeContext(UMB_LANGUAGE_WORKSPACE_CONTEXT, (context) => {
			this.#workspaceContext = context;
			this.#observeData();
		});
	}

	#observeData() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.data, (data) => {
			this._language = data;
		});
		this.observe(this.#workspaceContext.isNew, (isNew) => {
			this._isNew = isNew;
		});
	}

	#handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`<umb-workspace-editor alias="Umb.Workspace.Language">
			<div id="header" slot="header">
				<uui-button label="Navigate back" href="section/settings/workspace/language-root" compact>
					<uui-icon name="icon-arrow-left"></uui-icon>
				</uui-button>
				${this._isNew
					? html`<strong>Add language</strong>`
					: html`<uui-input
							label="Language name"
							value=${ifDefined(this._language?.name)}
							@input="${this.#handleInput}"></uui-input>`}
			</div>
		</umb-workspace-editor>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#header {
				display: flex;
				padding: 0 var(--uui-size-space-6);
				gap: var(--uui-size-space-4);
				width: 100%;
			}

			uui-input {
				width: 100%;
			}

			strong {
				display: flex;
				align-items: center;
			}

			#footer-into {
				padding: 0 var(--uui-size-layout-1);
			}

			uui-input:not(:focus) {
				border: 1px solid transparent;
			}
		`,
	];
}

export default UmbLanguageWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-workspace-editor': UmbLanguageWorkspaceEditorElement;
	}
}
