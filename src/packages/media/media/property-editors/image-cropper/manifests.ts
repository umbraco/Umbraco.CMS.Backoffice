import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.ImageCropper',
	name: 'Image Cropper Property Editor UI',
	js: () => import('./property-editor-ui-image-cropper.element.js'),
	meta: {
		label: 'Image Cropper',
		icon: 'icon-crop',
		group: 'pickers',
		propertyEditorSchemaAlias: 'Umbraco.ImageCropper',
	},
};
