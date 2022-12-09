import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';
import type { ManifestEditorView, ManifestWithLoader } from '@umbraco-cms/models';

import '../shared/editor-content/editor-content.element';

@customElement('umb-editor-document')
export class UmbEditorDocumentElement extends LitElement {
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
	entityKey!: string;

	constructor() {
		super();

		this._registerEditorViews();
	}

	private _registerEditorViews() {
		const dashboards: Array<ManifestWithLoader<ManifestEditorView>> = [
			{
				type: 'editorView',
				alias: 'Umb.EditorView.Document.Edit',
				name: 'Document Editor Edit View',
				loader: () => import('../shared/editor-content/views/edit/editor-view-content-edit.element'),
				weight: 200,
				meta: {
					editors: ['Umb.Editor.Document'],
					label: 'Info',
					pathname: 'content',
					icon: 'document',
				},
			},
			{
				type: 'editorView',
				alias: 'Umb.EditorView.Document.Info',
				name: 'Document Editor Info View',
				loader: () => import('../shared/editor-content/views/info/editor-view-content-info.element'),
				weight: 100,
				meta: {
					editors: ['Umb.Editor.Document'],
					label: 'Info',
					pathname: 'info',
					icon: 'info',
				},
			},
		];

		dashboards.forEach((dashboard) => {
			if (umbExtensionsRegistry.isRegistered(dashboard.alias)) return;
			umbExtensionsRegistry.register(dashboard);
		});
	}

	render() {
		return html`<umb-editor-content .entityKey=${this.entityKey} alias="Umb.Editor.Document"></umb-editor-content>`;
	}
}

export default UmbEditorDocumentElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-document': UmbEditorDocumentElement;
	}
}
