import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

// TODO: Missing propertyEditorSchemaAlias ?
export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.Tags.StorageType',
	name: 'Tags Storage Type Property Editor UI',
	loader: () => import('./property-editor-ui-tags-storage-type.element.js'),
	meta: {
		label: 'Tags Storage Type',
		propertyEditorSchemaAlias: '',
		icon: 'icon-autofill',
		group: 'common',
	},
};
