import { UmbDictionaryWorkspaceContext } from './dictionary-workspace.context.js';
import { UUIInputElement, UUIInputEvent, UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
@customElement('umb-dictionary-workspace-editor')
export class UmbDictionaryWorkspaceEditorElement extends UmbLitElement {
	@state()
	private _name?: string | null = '';

	#workspaceContext?: UmbDictionaryWorkspaceContext;

	constructor() {
		super();

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance as UmbDictionaryWorkspaceContext;
			this.#observeName();
		});
	}

	#observeName() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.name, (name) => (this._name = name));
	}

	// TODO. find a way where we don't have to do this for all workspaces.
	#handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`
			<umb-workspace-editor alias="Umb.Workspace.Dictionary">
				<uui-button id="back-nav" slot="pre" href="/section/translation/dashboard" label="Back to list" compact>
					<uui-icon name="umb:arrow-left"></uui-icon>
				</uui-button>
				<uui-input
					id="name-input"
					slot="header"
					.value=${this._name}
					@input="${this.#handleInput}"
					label="Dictionary name"></uui-input>
			</umb-workspace-editor>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			#back-nav {
				height: 100%;
				aspect-ratio: 1;
			}

			#name-input {
				margin-left: calc(var(--uui-size-layout-1) * -1);
				width: calc(100% + var(--uui-size-layout-1));
			}
			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbDictionaryWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dictionary-workspace-editor': UmbDictionaryWorkspaceEditorElement;
	}
}
