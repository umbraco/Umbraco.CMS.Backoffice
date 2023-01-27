import type { ManifestPropertyEditorUI } from '@umbraco-cms/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.MultipleTextString',
	name: 'Multiple Text String Property Editor UI',
	loader: () => import('./property-editor-ui-multiple-text-string.element'),
	meta: {
		label: 'Multiple Text String',
		propertyEditorModel: 'Umbraco.MultipleTextString',
		icon: 'umb:ordered-list',
		group: '',
		supportsReadOnly: true,
	},
};
