import { UMB_COLLECTION_ALIAS_CONDITION } from '@umbraco-cms/backoffice/collection';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'collectionAction',
		name: 'Create Language Collection Action',
		alias: 'Umb.CollectionAction.Language.Create',
		weight: 200,
		element: () => import('./create-language-collection-action.element.js'),
		meta: {
			label: '#general_create',
		},
		conditions: [
			{
				alias: UMB_COLLECTION_ALIAS_CONDITION,
				match: 'Umb.Collection.Language',
			},
		],
	},
];
