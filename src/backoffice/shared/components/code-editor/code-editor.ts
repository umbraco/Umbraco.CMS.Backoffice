import { LitElement } from 'lit';
import * as monaco from 'monaco-editor';

export type EditorLanguage = 'razor' | 'typescript' | 'javascript' | 'css';
export type EditorTheme = 'dark' | 'light' | 'high-contrast';

export interface UmbCodeEditorHost extends LitElement {
	container: HTMLElement;
	language: EditorLanguage;
	theme: EditorTheme;
	code: string;
	readonly: boolean;
}

export class UmbCodeEditor {
	private _host: UmbCodeEditorHost;
	private _editor: monaco.editor.IStandaloneCodeEditor;

	constructor(host: UmbCodeEditorHost) {
		this._host = host;
		this._editor = monaco.editor.create(this._host.container, {
			value: this._host.code ?? '',
			language: this._host.language,
			theme: this._host.theme,
			automaticLayout: true,
			readOnly: this._host.readonly,
		});
	}
}
