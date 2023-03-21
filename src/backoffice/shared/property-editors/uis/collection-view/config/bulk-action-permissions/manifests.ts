import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/extensions-registry';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.CollectionView.BulkActionPermissions',
	name: 'Collection View Bulk Action Permissions Property Editor UI',
	loader: () => import('./property-editor-ui-collection-view-bulk-action-permissions.element'),
	meta: {
		label: 'Collection View Bulk Action Permissions',
		propertyEditorModel: '',
		icon: 'umb:autofill',
		group: 'lists',
	},
};
