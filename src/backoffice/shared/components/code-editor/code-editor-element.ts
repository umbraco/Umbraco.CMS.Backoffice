import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

// -- Monaco Editor Imports --
import * as monaco from 'monaco-editor';
import { EditorLanguage } from './code-editor';

import { monacoEditorStyles } from './styles';

//!ISSUES: https://github.com/microsoft/monaco-editor/issues/1997 - razor templates do not get proper syntax highligh, like they do in vsCode

@customElement('umb-code-editor')
export class UmbCodeEditorElement extends LitElement {
	static styles = [
		monacoEditorStyles,
		css`
			:host {
				display: block;
				--editor-width: 100%;
				--editor-height: 100%;
			}
			#editor-container {
				width: var(--editor-width);
				height: var(--editor-height);
			}
		`,
	];

	private container: Ref<HTMLElement> = createRef();
	editor?: monaco.editor.IStandaloneCodeEditor;
	@property()
	theme: 'vs-light' | 'vs-dark' | 'hc-black' = 'vs-light';

	@property()
	language: EditorLanguage = 'javascript';

	#code = '';
	@property()
	get code() {
		return this.#code;
	}

	set code(value: string) {
		const oldValue = this.#code;

		this.#code = value;
		if (this.editor && this.#code !== oldValue) {
			this.#setValue(this.#code);
		}
		this.requestUpdate('code', oldValue);
	}

	@property({ type: Boolean, attribute: 'readonly' })
	readOnly = false;

	private getFile() {
		if (this.children.length > 0) return this.children[0];
		return null;
	}

	private getCode() {
		if (this.code) return this.code;
		const file = this.getFile();
		if (!file) return;
		return file.innerHTML.trim();
	}

	private getLang() {
		if (this.language) return this.language;
		const file = this.getFile();
		if (!file) return;
		const type = file.getAttribute('type')!;
		return type.split('/').pop()!;
	}

	private getTheme() {
		if (this.theme) return this.theme;
		if (this.isDark()) return 'vs-dark';
		return 'vs-light';
	}

	private isDark() {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	#setValue(value: string) {
		if (!this.editor) return;
		this.editor.setValue(value);
	}

	#getValue() {
		if (!this.editor) return '';
		const value = this.editor.getValue();
		return value;
	}

	setReadOnly(value: boolean) {
		this.readOnly = value;
		this.setOptions({ readOnly: value });
	}

	setOptions(value: monaco.editor.IStandaloneEditorConstructionOptions) {
		this.editor!.updateOptions(value);
	}

	firstUpdated() {
		this.editor = monaco.editor.create(this.container.value!, {
			value: this.#code,
			language: this.getLang(),
			theme: this.getTheme(),
			automaticLayout: true,
			readOnly: this.readOnly,
		});
		this.editor.focus();
		this.editor.onDidChangeModelContent(() => {
			this.#code = this.#getValue();
			this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, detail: {} }));
		});
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			monaco.editor.setTheme(this.getTheme());
		});
	}

	render() {
		return html` <div id="editor-container" ${ref(this.container)}></div> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-code-editor': UmbCodeEditorElement;
	}
}
