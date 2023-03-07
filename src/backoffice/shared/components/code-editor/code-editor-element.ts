import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

// -- Monaco Editor Imports --
import * as monaco from 'monaco-editor';
//eslint-disable-next-line
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
//eslint-disable-next-line
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
//eslint-disable-next-line
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
//eslint-disable-next-line
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
//eslint-disable-next-line
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

@customElement('umb-code-editor')
export class UmbCodeEditorElement extends LitElement {
	private container: Ref<HTMLElement> = createRef();
	editor?: monaco.editor.IStandaloneCodeEditor;
	@property()
	theme: 'vs-light' | 'vs-dark' | 'hc-black' = 'vs-light';

	@property()
	language: 'razor' | 'javascript' | 'css' = 'razor';

	@property()
	code?: string;

	static styles = css`
		:host {
			display: block;
			--editor-width: 100%;
			--editor-height: 100vh;
		}
		#editor-container {
			width: var(--editor-width);
			height: var(--editor-height);
		}
	`;

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

	firstUpdated() {
		this.editor = monaco.editor.create(this.container.value!, {
			value: this.getCode(),
			language: this.getLang(),
			theme: this.getTheme(),
			automaticLayout: true,
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
