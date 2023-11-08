/* eslint local-rules/enforce-umbraco-external-imports: 0 */
import styles from 'monaco-editor/min/vs/editor/editor.main.css';
//eslint-disable-next-line
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
//eslint-disable-next-line
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker.js?worker';
//eslint-disable-next-line
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
//eslint-disable-next-line
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
//eslint-disable-next-line
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker';
import { css, unsafeCSS } from '@umbraco-cms/backoffice/external/lit';

export const monacoEditorStyles = css`
	${unsafeCSS(styles)}
`;

export const monacoJumpingCursorHack = css`
	/* a hacky workaround this issue: https://github.com/microsoft/monaco-editor/issues/3217
	should probably be removed when the issue is fixed */
	.view-lines {
		font-feature-settings: revert !important;
	}
`;

const initializeWorkers = () => {
	self.MonacoEnvironment = {
		getWorker(workerId: string, label: string): Promise<Worker> | Worker {
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
};

initializeWorkers();

export * as monaco from 'monaco-editor';
