import {
	UMB_COLLECTION_ALIAS_CONDITION,
	UMB_WRITABLE_COLLECTION_CONDITION_ALIAS,
} from '@umbraco-cms/backoffice/collection';
import type { ManifestCollectionAction, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const createManifest: ManifestCollectionAction = {
	type: 'collectionAction',
	kind: 'button',
	name: 'Create Document Collection Action',
	alias: 'Umb.CollectionAction.Document.Create',
	element: () => import('./create-document-collection-action.element.js'),
	weight: 100,
	meta: {
		label: '#general_create',
	},
	conditions: [
		{
			alias: UMB_COLLECTION_ALIAS_CONDITION,
			match: 'Umb.Collection.Document',
		},
		{
			alias: UMB_WRITABLE_COLLECTION_CONDITION_ALIAS,
		},
	],
};

export const manifests: Array<ManifestTypes> = [createManifest];
