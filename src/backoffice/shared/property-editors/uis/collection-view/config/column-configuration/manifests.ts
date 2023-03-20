import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.CollectionView.ColumnConfiguration',
	name: 'Collection View Column Configuration Property Editor UI',
	loader: () => import('./property-editor-ui-collection-view-column-configuration.element'),
	meta: {
		label: 'Collection View Column Configuration',
		propertyEditorModel: '',
		icon: 'umb:autofill',
		group: 'lists',
	},
};
