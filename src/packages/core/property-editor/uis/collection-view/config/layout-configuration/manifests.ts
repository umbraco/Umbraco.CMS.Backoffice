import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.CollectionView.LayoutConfiguration',
	name: 'Collection View Column Configuration Property Editor UI',
	loader: () => import('./property-editor-ui-collection-view-layout-configuration.element.js'),
	meta: {
		label: 'Collection View Layout Configuration',
		propertyEditorSchemaAlias: '',
		icon: 'icon-autofill',
		group: 'lists',
	},
};
