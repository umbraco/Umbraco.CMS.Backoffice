import { UmbLitElement } from '@umbraco-cms/element';
import { css, html, LitElement, PropertyValueMap, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { UMB_THEME_CONTEXT_TOKEN } from '../../../themes/theme.context';
import { UmbCodeEditor } from './code-editor';
import { CodeEditorLanguage, CodeEditorTheme, UmbCodeEditorHost } from './code-editor.model';
import { monacoEditorStyles, monacoJumpingCursorHack } from './styles';

@customElement('umb-code-editor')
export class UmbCodeEditorElement extends UmbLitElement implements UmbCodeEditorHost {
	static styles = [
		monacoEditorStyles,
		monacoJumpingCursorHack,
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
		`,
	];

	private containerRef: Ref<HTMLElement> = createRef();

	get container() {
		if (!this.containerRef?.value) throw new Error('Container not found');
		return this.containerRef!.value;
	}

	#editor?: UmbCodeEditor;

	get editor() {
		return this.#editor;
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

	constructor() {
		super();
		this.consumeContext(UMB_THEME_CONTEXT_TOKEN, (instance) => {
			instance.theme.subscribe((themeAlias) => {
				console.log('themeAlias', themeAlias);
				this.theme = themeAlias ? this.#translateTheme(themeAlias) : CodeEditorTheme.Light;
			});
		});
	}

	firstUpdated() {
		this.#editor = new UmbCodeEditor(this);
	}

	protected updated(_changedProperties: PropertyValues<this>): void {
		if (_changedProperties.has('theme') || _changedProperties.has('language')) {
			this.#editor?.updateOptions({
				theme: this.theme,
				language: this.language,
			});
		}
	}

	#translateTheme(theme: string) {
		switch (theme) {
			case 'umb-light-theme':
				return CodeEditorTheme.Light;
			case 'umb-dark-theme':
				return CodeEditorTheme.Dark;
			case 'umb-high-contrast-theme':
				return CodeEditorTheme.HighContrastLight;
			default:
				return CodeEditorTheme.Light;
		}
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
