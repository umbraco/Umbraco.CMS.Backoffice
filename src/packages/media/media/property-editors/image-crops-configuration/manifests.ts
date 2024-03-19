import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.ImageCropsConfiguration',
	name: 'Image Crops Configuration Property Editor UI',
	js: () => import('./property-editor-ui-image-crops-configuration.element.js'),
	meta: {
		label: 'Image Crops Configuration',
		icon: 'icon-autofill',
		group: 'common',
	},
};
