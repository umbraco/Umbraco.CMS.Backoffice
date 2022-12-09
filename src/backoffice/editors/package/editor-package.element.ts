import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../shared/editor-content-layout/editor-content-layout.element';

@customElement('umb-editor-package')
export class UmbEditorPackageElement extends LitElement {
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

	render() {
		return html`<umb-editor-content-layout alias="Umb.Editor.Package">PACKAGE EDITOR</umb-editor-content-layout> `;
	}
}

export default UmbEditorPackageElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-package': UmbEditorPackageElement;
	}
}
