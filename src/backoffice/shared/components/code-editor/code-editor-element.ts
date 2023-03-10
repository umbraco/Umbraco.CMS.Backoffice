import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';


import { CodeEditorLanguage, CodeEditorTheme, UmbCodeEditor, UmbCodeEditorHost } from './code-editor';

import { monacoEditorStyles } from './styles';

@customElement('umb-code-editor')
export class UmbCodeEditorElement extends LitElement implements UmbCodeEditorHost {
	static styles = [
		monacoEditorStyles,
		css`
			:host {
				display: block;
			}
			#editor-container {
				width: var(--editor-width);
				height: var(--editor-height, 100%);
			}
		`,
	];

	private containerRef: Ref<HTMLElement> = createRef();

	get container() {
		if (!this.containerRef?.value) throw new Error('Container not found');
		return this.containerRef!.value;
	}

	@property()
	theme: CodeEditorTheme = CodeEditorTheme.Light;

	@property()
	language: CodeEditorLanguage = 'javascript';

	#code = '';
	@property()
	get code() {
		return this.#code;
	}

	set code(value: string) {
		const oldValue = this.#code;
		this.#code = value;
		if (this.#editor) {
			this.#editor.value = value;
		}
		this.requestUpdate('code', oldValue);
	}

	@property({ type: Boolean, attribute: 'readonly' })
	readonly = false;

	#editor?: UmbCodeEditor;

	firstUpdated() {
		this.#editor = new UmbCodeEditor(this);
	}

	insert(text: string) {
		this.#editor?.insertText(text);
	}

	render() {
		return html` <div id="editor-container" ${ref(this.containerRef)}></div> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-code-editor': UmbCodeEditorElement;
	}
}
