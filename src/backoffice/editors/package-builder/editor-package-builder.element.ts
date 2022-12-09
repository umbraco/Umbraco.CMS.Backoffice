import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../shared/editor-node-layout/editor-node-layout.element';

@customElement('umb-editor-package-builder')
export class UmbEditorPackageBuilderElement extends LitElement {
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
		return html`<umb-editor-node-layout alias="Umb.Editor.PackageBuilder"
			>PACKAGE BUILDER</umb-editor-node-layout
		> `;
	}
}

export default UmbEditorPackageBuilderElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-package-builder': UmbEditorPackageBuilderElement;
	}
}
