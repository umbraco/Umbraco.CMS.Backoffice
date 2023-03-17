import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { UmbCodeEditor } from './code-editor';
import { CodeEditorLanguage, CodeEditorTheme, UmbCodeEditorHost } from './code-editor.model';
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

				--vscode-scrollbar-shadow: #dddddd;
				--vscode-scrollbarSlider-background: var(--uui-color-disabled-contrast);
				--vscode-scrollbarSlider-hoverBackground: rgba(100, 100, 100, 0.7);
				--vscode-scrollbarSlider-activeBackground: rgba(0, 0, 0, 0.6);
			}

			/* a hacky workaround this issue: https://github.com/microsoft/monaco-editor/issues/3217 
			*/
			.view-lines {
				font-feature-settings: revert !important;
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

	@property()
	label = 'Code Editor';

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
		this.#editor?.insert(text);
	}

	find(text: string) {
		return this.#editor?.find(text);
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
