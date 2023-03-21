import * as initializeWorkers from './languageWorkers';
import { UmbCodeEditorElement } from './code-editor.element';
import { UmbCodeEditor } from './code-editor';
import { monacoEditorStyles } from './styles';

export default UmbCodeEditorElement;

export { initializeWorkers, UmbCodeEditor, UmbCodeEditorElement, monacoEditorStyles };
