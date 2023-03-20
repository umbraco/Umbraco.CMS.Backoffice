import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.CollectionView.LayoutConfiguration',
	name: 'Collection View Column Configuration Property Editor UI',
	loader: () => import('./property-editor-ui-collection-view-layout-configuration.element'),
	meta: {
		label: 'Collection View Layout Configuration',
		propertyEditorModel: '',
		icon: 'umb:autofill',
		group: 'lists',
	},
};
