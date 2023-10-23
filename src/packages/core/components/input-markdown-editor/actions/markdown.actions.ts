import { UmbInputMarkdownElement } from '../input-markdown.element.js';
import { monaco } from '@umbraco-cms/backoffice/external/monaco-editor';
import { UmbCodeEditorController } from '@umbraco-cms/backoffice/code-editor';

type TextMethod = 'bold' | 'italic' | 'code';

export class UmbMarkdownActionsController {
	#host?: UmbInputMarkdownElement;
	#editor?: UmbCodeEditorController;

	#actions: Array<monaco.editor.IActionDescriptor> = [
		{
			label: 'Add Heading H1',
			id: 'h1',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit1],
			run: () => this.toggleHeading(1),
		},
		{
			label: 'Add Heading H2',
			id: 'h2',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit2],
			run: () => this.toggleHeading(2),
		},
		{
			label: 'Add Heading H3',
			id: 'h3',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit3],
			run: () => this.toggleHeading(3),
		},
		{
			label: 'Add Heading H4',
			id: 'h4',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit4],
			run: () => this.toggleHeading(4),
		},
		{
			label: 'Add Heading H5',
			id: 'h5',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit5],
			run: () => this.toggleHeading(5),
		},
		{
			label: 'Add Heading H6',
			id: 'h6',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit6],
			run: () => this.toggleHeading(6),
		},
		{
			label: 'Add Bold Text',
			id: 'b',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
			run: () => this.formatText('bold'),
		},
		{
			label: 'Add Italic Text',
			id: 'i',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
			run: () => this.formatText('italic'),
		},
		{
			label: 'Add Quote',
			id: 'q',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyQ],
			run: () => this.toggleQuote(),
		},
		{
			label: 'Add Ordered List',
			id: 'ol',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],
			run: () => this.insertOl(),
		},
		{
			label: 'Add Unordered List',
			id: 'ul',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU],
			run: () => this.insertUl(),
		},
		{
			label: 'Add Code',
			id: 'code',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC],
			run: () => this.formatText('code'),
		},
		{
			label: 'Add Fenced Code',
			id: 'fenced-code',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
			run: () => this.insertFencedCode(),
		},
		{
			label: 'Add Line',
			id: 'line',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL],
			run: () => this.insertLine(),
		},
		/*
        {
            label: 'Add Link',
            id: 'link',
            //keybindings: [KeyMod.CtrlCmd | KeyCode.KeyM | KeyMod.CtrlCmd | KeyCode.KeyC],
            run: () => this._insertLink(),
            // TODO: Open in modal
        },
        {
            label: 'Add Image',
            id: 'image',
            //keybindings: [KeyMod.CtrlCmd | KeyCode.KeyM | KeyMod.CtrlCmd | KeyCode.KeyC],
            run: () => this._insertMedia(),
            // TODO: Open in modal
        }
        */
	];

	readonly actions = this.#actions;

	constructor(host: UmbInputMarkdownElement, editor: UmbCodeEditorController) {
		this.#host = host;
		this.#editor = editor;

		this.#addActions();
	}

	async #addActions() {
		this.#actions.forEach((action) => {
			this.#editor?.monacoEditor?.addAction(action);
		});
	}

	#getDecorator(method: TextMethod): string | undefined {
		switch (method) {
			case 'bold':
				return '**';
			case 'italic':
				return '*';
			case 'code':
				return '`';
			default:
				return undefined;
		}
	}

	#checkAndCountHashes(line: string = ''): number {
		const matches = /^#+/.exec(line);
		if (matches) {
			return matches[0].length;
		} else {
			return 0;
		}
	}

	#performEdits(edits: Array<monaco.editor.IIdentifiedSingleEditOperation> = [], ranges?: Array<monaco.IRange>) {
		if (edits) {
			this.#editor?.monacoEditor?.executeEdits('', edits);
		}
		if (ranges) {
			//Convert the ranges from IRange to ISelection
			const selections = ranges?.map((range): monaco.ISelection => {
				return {
					selectionStartLineNumber: range.startLineNumber,
					selectionStartColumn: range.startColumn,
					positionLineNumber: range.endLineNumber,
					positionColumn: range.endColumn,
				};
			});
			this.#editor?.monacoEditor?.setSelections(selections);
		}

		this.#host?.focusEditor();
	}

	/**
	 * Insert or edit heading at the selected lines to the specified heading, or remove heading if specified heading is the existing one.
	 * @param heading (h1 = 1) (h2 = 2) ... (h6 = 6). If not specified, using h1 as default
	 */
	public toggleHeading(heading: 1 | 2 | 3 | 4 | 5 | 6 = 1) {
		const selections = this.#editor?.getSelections();
		const edits = selections?.map((selection): monaco.editor.IIdentifiedSingleEditOperation => {
			const lastColumn = this.#editor?.monacoModel?.getLineMaxColumn(selection.endLineNumber);
			const string = this.#editor?.getValueInRange({
				...selection,
				startColumn: 0,
				endColumn: lastColumn || selection.endColumn,
			});
			const hashCount = this.#checkAndCountHashes(string);
			const strippedStringFromHash = string?.slice(hashCount, string.length).trimStart();

			if (hashCount !== heading) {
				// Edit hashes to match the desired heading.
				const strippedStringFromLineBreaks = strippedStringFromHash?.replace(/[\r\n]+/g, ' ');
				return {
					range: {
						...selection,
						startColumn: 0,
						endColumn: lastColumn || selection.endColumn,
					},
					text: '#'.repeat(heading) + ` ${strippedStringFromLineBreaks}` || '',
				};
			} else {
				// Undo the headings
				return {
					range: {
						...selection,
						startColumn: 0,
						endColumn: lastColumn || selection.endColumn,
					},
					text: strippedStringFromHash ?? '',
				};
			}
		});
		this.#performEdits(edits);
	}

	/**
	 * Insert quotes at the selected lines, or remove if selected line are already quoted.
	 */
	public toggleQuote() {
		const selections = this.#editor?.getSelections();
		const edits = selections?.map((selection): Array<monaco.editor.IIdentifiedSingleEditOperation> => {
			let lineIndex = selection.startLineNumber;
			const lineSelections = [];
			for (lineIndex; lineIndex < selection.endLineNumber; lineIndex++) {
				// Create an array for all lines selected so we can edit each of them
				const lastColumn = this.#editor?.monacoModel?.getLineMaxColumn(selection.endLineNumber) || 0;
				lineSelections.push({
					startLineNumber: lineIndex,
					endLineNumber: lineIndex,
					startColumn: 0,
					endColumn: lastColumn,
				});
			}

			// Check if we are going to perform inserts or removal of quote.
			// Rather than toggle quote on/off for each line, let's make the selected lines uniform (make them all quotes, or cancel all quotes).
			const initialLineIsQuote = this.#editor?.getValueInRange(selection).startsWith('>') || false;

			if (!initialLineIsQuote) {
				// Perform inserts of quote
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^>/, '').trimStart();
					return { range: lineSelection, text: `> ${string}` };
				});
				return edits;
			} else {
				//Removal of quote
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^>/, '').trimStart();
					return { range: lineSelection, text: `${string}` };
				});
				return edits;
			}
		});
		this.#performEdits(edits?.flat());
	}

	// TODO: Advanced actions in future, such as Strikethrough and Highlights. Strikethrough seems to be sanitized by sanitizeHtml?
	public formatText(method: TextMethod) {
		if (method === 'italic') {
			// Italic is more complicated due to the fact it shares decorator with Bold, but in a shorter version.
			this.formatTextItalic();
			return;
		}

		const decorator = this.#getDecorator(method);
		if (!decorator) return;

		const selections = this.#editor?.getSelections();

		// We also need to get the desired selections after edit, which is depends on the edit that is going to be fired.
		const editsAndSelections = selections?.map(
			(selection): { edit: monaco.editor.IIdentifiedSingleEditOperation; select: monaco.IRange } => {
				// Our original text selection
				const original = this.#editor?.getValueInRange(selection) || 'Example';

				// Selection of surrounding to check for decorators
				const rangedSelection = {
					...selection,
					startColumn: selection.startColumn - decorator.length,
					endColumn: selection.endColumn + decorator.length,
				};

				// Surrounding text selection
				const string = this.#editor?.getValueInRange(rangedSelection);

				if (string?.startsWith(decorator) && string.endsWith(decorator)) {
					// Action to perform cancel
					return {
						edit: { range: rangedSelection, text: string.slice(decorator.length, -1 * decorator.length) },
						select: {
							...selection,
							startColumn: selection.startColumn - decorator.length,
							endColumn: selection.startColumn + (original.length - decorator.length),
						},
					};
				} else {
					// Action to perform insert
					return {
						edit: { range: selection, text: `${decorator}${original}${decorator}` },
						select: {
							...selection,
							startColumn: selection.startColumn + decorator.length,
							endColumn: selection.startColumn + original.length + decorator.length,
						},
					};
				}
			},
		);

		if (!editsAndSelections) return;

		const edits = editsAndSelections?.map((obj) => obj.edit);
		const ranges = editsAndSelections?.map((obj) => obj.select);
		this.#performEdits(edits, ranges);
	}

	private formatTextItalic() {
		const decorator = this.#getDecorator('italic');
		const boldDecor = this.#getDecorator('bold');
		if (!decorator || !boldDecor) return;

		const selections = this.#editor?.getSelections();

		// We also need to get the desired selections after edit, which is depends on the edit that is going to be fired.
		const editsAndSelections = selections?.map(
			(selection): { edit: monaco.editor.IIdentifiedSingleEditOperation; select: monaco.IRange } => {
				// Our original text selection
				const original = this.#editor?.getValueInRange(selection) || 'Example';

				// Selection of surrounding to check for decorators
				const rangedSelection = {
					...selection,
					startColumn: selection.startColumn - (decorator.length + boldDecor.length),
					endColumn: selection.endColumn + (decorator.length + boldDecor.length),
				};

				// Surrounding text selection
				const string = this.#editor?.getValueInRange(rangedSelection);

				if (string?.startsWith(`${decorator}${boldDecor}`) && string.endsWith(`${decorator}${boldDecor}`)) {
					// Bold and Italic text. Perform removal of Italic.
					return {
						edit: { range: rangedSelection, text: `${boldDecor}${original}${boldDecor}` },
						select: {
							...rangedSelection,
							startColumn: rangedSelection.startColumn + boldDecor.length,
							endColumn: rangedSelection.startColumn + original.length + boldDecor.length,
						},
					};
				}
				if (string?.startsWith(boldDecor) && string.endsWith(boldDecor)) {
					// Bold text. Perform insert of Italic.
					return {
						edit: {
							range: selection,
							text: `${decorator}${original}${decorator}`,
						},
						select: {
							...selection,
							startColumn: selection.startColumn + decorator.length,
							endColumn: selection.startColumn + original.length + decorator.length,
						},
					};
				}
				if (string?.startsWith(decorator) && string.endsWith(decorator)) {
					// Italic text. Perform removal of Italic.
					return {
						edit: {
							range: {
								...selection,
								startColumn: selection.startColumn - decorator.length,
								endColumn: selection.endColumn + decorator.length,
							},
							text: `${original}`,
						},
						select: {
							...rangedSelection,
							startColumn: rangedSelection.startColumn + boldDecor.length,
							endColumn: rangedSelection.startColumn + original.length + boldDecor.length,
						},
					};
				}
				// No existing formatting. Perform insert of Italic.
				return {
					edit: { range: selection, text: `${decorator}${original}${decorator}` },
					select: {
						...selection,
						startColumn: selection.startColumn + decorator.length,
						endColumn: selection.startColumn + original.length + decorator.length,
					},
				};
			},
		);
		if (!editsAndSelections) return;

		const edits = editsAndSelections?.map((obj) => obj.edit);
		const ranges = editsAndSelections?.map((obj) => obj.select);
		this.#performEdits(edits, ranges);
	}

	public insertFencedCode() {
		const selections = this.#editor?.getSelections();

		const editsAndSelections = selections?.map(
			(selection): { edit: monaco.editor.IIdentifiedSingleEditOperation; select: monaco.IRange } => {
				const string = this.#editor?.getValueInRange(selection) || 'Fenced Code';

				const decorator = '```';

				// Check if we selected the first column. If not, make a line break.
				if (selection.startColumn !== 1) {
					return {
						edit: { range: selection, text: `\n${decorator}\n${string}\n${decorator}\n` },
						select: {
							...selection,
							startLineNumber: selection.startLineNumber + 2,
							endLineNumber: selection.endLineNumber + 2,
						},
					};
				} else {
					return {
						edit: { range: selection, text: `${decorator}\n${string}\n${decorator}\n` },
						select: {
							...selection,
							startLineNumber: selection.startLineNumber + 1,
							endLineNumber: selection.endLineNumber + 1,
						},
					};
				}
			},
		);

		if (!editsAndSelections) return;

		const edits = editsAndSelections?.map((obj) => obj.edit);
		const ranges = editsAndSelections?.map((obj) => obj.select);
		this.#performEdits(edits, ranges);
	}

	public insertLine() {
		const selections = this.#editor?.getSelections();

		selections?.forEach((selection) => {
			// Note: Need two line breaks to trigger the line preview. Figure out how many we got.

			const previousEndColumn = this.#editor?.monacoModel?.getLineMaxColumn(Math.max(selection.endLineNumber - 1, 1));
			const endColumn = this.#editor?.monacoModel?.getLineMaxColumn(selection.endLineNumber) || 1;

			if (endColumn === 1 && (previousEndColumn !== 1 || selection.endLineNumber === 1)) {
				this.#editor?.insertAtPosition('---\n', {
					lineNumber: selection.endLineNumber,
					column: 1,
				});
			} else if (endColumn === 1 && previousEndColumn === 1) {
				this.#editor?.insertAtPosition('\n---\n', {
					lineNumber: selection.endLineNumber,
					column: 1,
				});
			} else {
				this.#editor?.insertAtPosition('\n\n---\n', {
					lineNumber: selection.endLineNumber,
					column: endColumn,
				});
			}
			this.#host?.focusEditor();
		});
	}

	public insertUl() {
		const selections = this.#editor?.getSelections();
		const edits = selections?.map((selection): Array<monaco.editor.IIdentifiedSingleEditOperation> => {
			let lineIndex = selection.startLineNumber;
			const lineSelections = [];
			for (lineIndex; lineIndex <= selection.endLineNumber; lineIndex++) {
				// Create an array for all lines selected so we can edit each of them
				const lastColumn = this.#editor?.monacoModel?.getLineMaxColumn(selection.endLineNumber) || 1;
				lineSelections.push({
					startLineNumber: lineIndex,
					endLineNumber: lineIndex,
					startColumn: 1,
					endColumn: lastColumn,
				});
			}

			// Check if we are going to perform inserts or removal of ul items.
			// Rather than toggle ul on/off for each line, let's make the selected lines uniform (make them all ul items, or cancel all ul items).
			const initialLineIsUl = this.#editor?.getValueInRange({ ...selection, startColumn: 1 }).startsWith('-') || false;
			if (!initialLineIsUl) {
				// Perform inserts of ul
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^[-]/, '').trimStart();
					return { range: lineSelection, text: `- ${string}` };
				});
				return edits;
			} else {
				//Removal of ul
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^[-]/, '').trimStart();
					return { range: lineSelection, text: `${string}` };
				});
				return edits;
			}
		});
		this.#performEdits(edits?.flat());
	}

	public insertOl() {
		console.log('ol');
		const selections = this.#editor?.getSelections();
		const edits = selections?.map((selection): Array<monaco.editor.IIdentifiedSingleEditOperation> | void => {
			let lineIndex = selection.startLineNumber;
			const lineSelections = [];
			for (lineIndex; lineIndex <= selection.endLineNumber; lineIndex++) {
				// Create an array for all lines selected so we can edit each of them
				const lastColumn = this.#editor?.monacoModel?.getLineMaxColumn(selection.endLineNumber) || 1;
				lineSelections.push({
					startLineNumber: lineIndex,
					endLineNumber: lineIndex,
					startColumn: 1,
					endColumn: lastColumn,
				});
			}

			//const previousEndColumn = this.#editor?.monacoModel?.getLineMaxColumn(Math.max(selection.endLineNumber - 1, 1));

			/*
			const previousLine = this.#editor?.getValueInRange({
				...selection,
                startColumn: 1,
				startLineNumber: selection.startLineNumber - 1,
			});

			console.log('previous line', previousLine);
            */

			// Check if we are going to perform inserts or removal of ol items.
			// Rather than toggle ol on/off for each line, let's make the selected lines uniform (make them all ol items, or cancel all ol items).

			const initialLineIsOl = this.#editor?.getValueInRange({ ...selection, startColumn: 1 }).match(/^[1-9]\d*\..*/);

			//

			/*
			if (!initialLineIsOl) {
				// Perform inserts of ul
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^[-]/, '').trimStart();
					return { range: lineSelection, text: `- ${string}` };
				});
				return edits;
			} else {
				//Removal of ul
				const edits = lineSelections.map((lineSelection): monaco.editor.IIdentifiedSingleEditOperation => {
					const string = this.#editor?.getValueInRange(lineSelection).replace(/^[-]/, '').trimStart();
					return { range: lineSelection, text: `${string}` };
				});
				return edits;
			}
            */
		});
		//this.#performEdits(edits?.flat());
	}
}
