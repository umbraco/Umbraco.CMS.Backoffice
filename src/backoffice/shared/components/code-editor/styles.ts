import { css, unsafeCSS } from 'lit';
import styles from 'monaco-editor/min/vs/editor/editor.main.css?inline';

export const monacoEditorStyles = css`
	${unsafeCSS(styles)}
`;
