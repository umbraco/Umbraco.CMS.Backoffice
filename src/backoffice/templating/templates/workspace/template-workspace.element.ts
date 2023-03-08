import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UUIInputElement, UUITextareaElement } from '@umbraco-ui/uui';
import { UmbTemplateWorkspaceContext } from './template-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import { UmbCodeEditorElement } from 'src/backoffice/shared/components/code-editor/code-editor-element';

@customElement('umb-template-workspace')
export class UmbTemplateWorkspaceElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#content {
				height: 100%;
			}
		`,
	];

	public load(entityKey: string) {
		this.#templateWorkspaceContext.load(entityKey);
	}

	public create(parentKey: string | null) {
		this.#isNew = true;
		this.#templateWorkspaceContext.createScaffold(parentKey);
	}

	@state()
	private _name?: string | null = '';

	@state()
	private _content?: string | null = '';

	#templateWorkspaceContext = new UmbTemplateWorkspaceContext(this);
	#isNew = false;

	async connectedCallback() {
		super.connectedCallback();

		this.observe(this.#templateWorkspaceContext.name, (name) => {
			this._name = name;
		});

		this.observe(this.#templateWorkspaceContext.content, (content) => {
			this._content = content;
		});
	}

	// TODO: temp code for testing create and save
	#onNameInput(event: Event) {
		const target = event.target as UUIInputElement;
		const value = target.value as string;
		this.#templateWorkspaceContext.setName(value);
	}

	//TODO - debounce that
	#onCodeEditorInput(event: Event) {
		const target = event.target as UmbCodeEditorElement;
		const value = target.code as string;
		this.#templateWorkspaceContext.setContent(value);
	}

	render() {
		// TODO: add correct UI elements
		return html`<umb-workspace-layout alias="Umb.Workspace.Template">
			<uui-input .value=${this._name} @input=${this.#onNameInput}></uui-input>
			<umb-code-editor
				language="razor"
				id="content"
				.code=${this._content ?? ''}
				@input=${this.#onCodeEditorInput}></umb-code-editor>
		</umb-workspace-layout>`;
	}
}

export default UmbTemplateWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-template-workspace': UmbTemplateWorkspaceElement;
	}
}
