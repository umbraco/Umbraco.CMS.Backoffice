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

export interface UmbCodeEditorCursorPosition {
	column: number;
	lineNumber: number;
}

export interface UmbCodeEditorCursorPositionChangedEvent {
	position: UmbCodeEditorCursorPosition;
	secondaryPositions: UmbCodeEditorCursorPosition[];
}

//!ISSUES: https://github.com/microsoft/monaco-editor/issues/1997 - razor templates do not get proper syntax highligh, like they do in vsCode

export class UmbCodeEditor {
	private _host: UmbCodeEditorHost;
	#editor?: monaco.editor.IStandaloneCodeEditor;

	get editor() {
		return this.#editor;
	}

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
		if (!this.#editor) throw new Error('Editor object not found');
		this.#editor.updateOptions(newOptions);
	}

	set value(newValue: string) {
		if (!this.#editor) throw new Error('Editor object not found');

		const oldValue = this.value;
		if (newValue !== oldValue) {
			this.#editor.setValue(newValue);
		}
	}

	get value() {
		if (!this.#editor) return '';
		const value = this.#editor.getValue();
		return value;
	}

	createEditor() {
		if (!this._host.container) throw new Error('Container not found');
		if (this._host.container.hasChildNodes()) throw new Error('Editor container should be empty');
		this.#editor = monaco.editor.create(this._host.container, {
			...this.options,
			value: this._host.code ?? '',
			language: this._host.language,
			theme: this._host.theme,
			automaticLayout: true,
			readOnly: this._host.readonly,
			scrollBeyondLastLine: false,
			scrollbar: {
				verticalScrollbarSize: 5,
			},
		});
		this.#initiateEvents();
	}

	getSelections(): monaco.ISelection[] {
		if (!this.#editor) return [];
		return this.#editor.getSelections() ?? [];
	}

	getPositions(): monaco.IPosition | null {
		if (!this.#editor) return null;
		return this.#editor.getPosition();
	}

	insertText(text: string) {
		if (!this.#editor) throw new Error('Editor object not found');
		const selections = this.#editor.getSelections() ?? [];
		if (selections?.length > 0) {
			this.#editor.executeEdits(
				null,
				selections.map((selection) => ({ range: selection, text }))
			);
			return;
		}
	}

	#position: UmbCodeEditorCursorPosition | null = null;
	#secondaryPositions: UmbCodeEditorCursorPosition[] = [];

	#initiateEvents() {
		this.#editor?.onDidChangeModelContent((e) => {
			this._host.code = this.value ?? '';
			console.log(e);
			this._host.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, detail: {} }));
		});
		this.#editor?.onDidChangeCursorPosition((e) => {
			this.#position = e.position;
			this.#secondaryPositions = e.secondaryPositions;
		});
	}

	onChangeModelContent(callback: (e: monaco.editor.IModelContentChangedEvent | undefined) => void) {
		this.#editor?.onDidChangeModelContent((event) => {
			callback(event);
		});
	}

	onDidChangeModel(callback: (e: monaco.editor.IModelChangedEvent | undefined) => void) {
		this.#editor?.onDidChangeModel((event) => {
			callback(event);
		});
	}

	onDidChangeCursorPosition(callback: (e: UmbCodeEditorCursorPositionChangedEvent | undefined) => void) {
		this.#editor?.onDidChangeCursorPosition((event) => {
			callback(event);
		});
	}
}