import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.MediaPicker',
	name: 'Markdown Editor Property Editor UI',
	js: () => import('./property-editor-ui-media-picker.element.js'),
	meta: {
		label: 'Media Picker',
		propertyEditorSchemaAlias: 'Umbraco.MediaPicker',
		icon: 'icon-picture',
		group: 'pickers',
	},
};
