import * as monaco from 'monaco-editor';
import {
	CodeEditorConstructorOptions,
	CodeEditorSearchOptions,
	UmbCodeEditorCursorPosition,
	UmbCodeEditorCursorPositionChangedEvent,
	UmbCodeEditorHost,
} from './code-editor.model';

/**
 * This is a wrapper class for the monaco editor. It exposes some of the monaco editor API. It also handles the creation of the monaco editor.
 * It also allows access to the entire monaco editor object through editor property, but mind the fact that editor might be swapped in the future for a different library, so use on your own responsibility.
 * Through the UmbCodeEditorHost interface it can be used in a custom element.
 *
 * @export
 * @class UmbCodeEditor
 */
export class UmbCodeEditor {
	private _host: UmbCodeEditorHost;
	#editor?: monaco.editor.IStandaloneCodeEditor;

	get editor() {
		return this.#editor;
	}

	#options: CodeEditorConstructorOptions = {};
	get options(): CodeEditorConstructorOptions {
		return this.#options;
	}

	#defaultMonacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
		automaticLayout: true,
		scrollBeyondLastLine: false,
		scrollbar: {
			verticalScrollbarSize: 5,
		},
	};

	constructor(host: UmbCodeEditorHost, options?: CodeEditorConstructorOptions) {
		this.#options = { ...options };
		this._host = host;
		try {
			this.createEditor(options);
		} catch (e) {
			console.error(e);
		}
	}

	updateOptions(newOptions: CodeEditorConstructorOptions) {
		if (!this.#editor) throw new Error('Editor object not found');
		this.#editor.updateOptions(this.#mapOptions(newOptions));
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

	get model() {
		if (!this.#editor) return null;
		return this.#editor.getModel();
	}

	#mapOptions(options: CodeEditorConstructorOptions): monaco.editor.IStandaloneEditorConstructionOptions {
		const hasLineNumbers = Object.prototype.hasOwnProperty.call(options, 'lineNumbers');
		const hasMinimap = Object.prototype.hasOwnProperty.call(options, 'minimap');
		const hasLightbulb = Object.prototype.hasOwnProperty.call(options, 'lightbulb');

		return {
			...options,
			lineNumbers: hasLineNumbers ? (options.lineNumbers ? 'on' : 'off') : undefined,
			minimap: hasMinimap ? (options.minimap ? { enabled: true } : { enabled: false }) : undefined,
			lightbulb: hasLightbulb ? (options.lightbulb ? { enabled: true } : { enabled: false }) : undefined,
		};
	}

	createEditor(options: CodeEditorConstructorOptions = {}) {
		if (!this._host.container) throw new Error('Container not found');
		if (this._host.container.hasChildNodes()) throw new Error('Editor container should be empty');

		const mergedOptions = { ...this.#defaultMonacoOptions, ...this.#mapOptions(options) };

		this.#editor = monaco.editor.create(this._host.container, {
			...mergedOptions,
			value: this._host.code ?? '',
			language: this._host.language,
			theme: this._host.theme,
			readOnly: this._host.readonly,
			ariaLabel: this._host.label,
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

	insert(text: string) {
		if (!this.#editor) throw new Error('Editor object not found');
		const selections = this.#editor.getSelections() ?? [];
		if (selections?.length > 0) {
			this.#editor.executeEdits(
				null,
				selections.map((selection) => ({ range: selection, text }))
			);
		}
	}

	find(searchString: string, searchOptions: CodeEditorSearchOptions = <CodeEditorSearchOptions>{}) {
		if (!this.#editor) throw new Error('Editor object not found');
		const defaultOptions = {
			searchOnlyEditableRange: false,

			isRegex: false,

			matchCase: false,

			wordSeparators: null,

			captureMatches: false,
		};

		const { searchOnlyEditableRange, isRegex, matchCase, wordSeparators, captureMatches } = {
			...defaultOptions,
			...searchOptions,
		};
		return this.model?.findMatches(
			searchString,
			searchOnlyEditableRange,
			isRegex,
			matchCase,
			wordSeparators,
			captureMatches
		);
	}

	//INSERT AT POSITION

	//SELECT

	#position: UmbCodeEditorCursorPosition | null = null;
	get position() {
		return this.#position;
	}
	#secondaryPositions: UmbCodeEditorCursorPosition[] = [];
	get secondaryPositions() {
		return this.#secondaryPositions;
	}

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