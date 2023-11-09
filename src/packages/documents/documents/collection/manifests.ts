import { ManifestCollectionView } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestCollectionView> = [
	{
		type: 'collectionView',
		alias: 'Umb.CollectionView.Document.Table',
		name: 'Document Table Collection View',
		loader: () => import('./views/table/document-table-collection-view.element.js'),
		weight: 200,
		conditions: {
			entityType: 'document',
		},
		meta: {
			label: 'Table',
			icon: 'icon-box',
			pathName: 'table',
		},
	},
];
