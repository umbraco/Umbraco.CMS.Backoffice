import * as monaco from 'monaco-editor';

export type CodeEditorLanguage = 'razor' | 'typescript' | 'javascript' | 'css' | 'markdown' | 'json' | 'html';

export enum CodeEditorTheme {
	Light = 'vs',
	Dark = 'vs-dark',
	HighContrastLight = 'hc-light',
	HighContrastDark = 'hc-black',
}

export interface UmbCodeEditorHost extends HTMLElement {
	container: HTMLElement;
	language: CodeEditorLanguage;
	theme: CodeEditorTheme;
	code: string;
	readonly: boolean;
}

//!ISSUES: https://github.com/microsoft/monaco-editor/issues/1997 - razor templates do not get proper syntax highligh, like they do in vsCode

export class UmbCodeEditor {
	private _host: UmbCodeEditorHost;
	editor?: monaco.editor.IStandaloneCodeEditor;

	options: monaco.editor.IEditorOptions = {};

	constructor(host: UmbCodeEditorHost) {
		this._host = host;
		try {
			this.createEditor();
		} catch (e) {
			console.error(e);
		}
	}

	updateOptions(newOptions: monaco.editor.IStandaloneEditorConstructionOptions) {
		if (!this.editor) return;
		this.editor.updateOptions(newOptions);
	}

	insertSnippet(snippet: string) {
		if (!this.editor) return;
		this.editor.trigger('snippet', 'editor.action.insertSnippet', { snippet });
	}

	set value(newValue: string) {
		if (!this.editor) return;
		const oldValue = this.value;
		if (newValue !== oldValue) {
			this.editor.setValue(newValue);
		}
	}

	get value() {
		if (!this.editor) return '';
		const value = this.editor.getValue();
		return value;
	}

	createEditor() {
		if (!this._host.container) throw new Error('Container not found');
		if (this._host.container.hasChildNodes()) throw new Error('Editor container should be empty');
		this.editor = monaco.editor.create(this._host.container, {
			...this.options,
			value: this._host.code ?? '',
			language: this._host.language,
			theme: this._host.theme,
			automaticLayout: true,
			readOnly: this._host.readonly,
		});
		this.#initiateEvents();
	}

	insertText(text: string) {
		if (!this.editor) return;
		this.editor.executeEdits('', [
			{
				range: {
					startLineNumber: this.#position?.lineNumber ?? 0,
					startColumn: this.#position?.column ?? 0,
					endLineNumber: this.#position?.lineNumber ?? 0,
					endColumn: this.#position?.column ?? 0,
				},
				text,
				forceMoveMarkers: true,
			},
		]);
		this.editor.focus();
	}

	#position: monaco.IPosition | null = null;

	#initiateEvents() {
		this.editor?.onDidChangeModelContent(() => {
			this._host.code = this.value ?? '';
			this._host.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, detail: {} }));
		});
		this.editor?.onDidChangeCursorPosition((e) => {
			this.#position = e.position;
		});
	}

	onChangeModelContent<T>(callback: (e: monaco.editor.IModelContentChangedEvent | undefined) => T) {
		let callbackReturnValue: T;
		this.editor?.onDidChangeModelContent((event) => {
			callbackReturnValue = callback(event);
			return callbackReturnValue;
		});
	}
}
