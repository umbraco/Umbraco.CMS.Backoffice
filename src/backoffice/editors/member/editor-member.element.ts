import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../shared/editor-content-layout/editor-content-layout.element';

@customElement('umb-editor-member')
export class UmbEditorMemberElement extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];

	@property()
	id!: string;

	render() {
		return html` <umb-editor-content-layout alias="Umb.Editor.Member">Member Editor</umb-editor-content-layout> `;
	}
}

export default UmbEditorMemberElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-member': UmbEditorMemberElement;
	}
}
