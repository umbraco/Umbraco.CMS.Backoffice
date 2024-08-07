import { UMB_COLLECTION_ALIAS_CONDITION } from '@umbraco-cms/backoffice/collection';
import type { ManifestCollectionAction, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const createManifest: ManifestCollectionAction = {
	type: 'collectionAction',
	kind: 'button',
	name: 'Create Language Collection Action',
	alias: 'Umb.CollectionAction.Language.Create',
	weight: 200,
	meta: {
		label: '#general_create',
		href: 'section/settings/workspace/language/create',
	},
	conditions: [
		{
			alias: UMB_COLLECTION_ALIAS_CONDITION,
			match: 'Umb.Collection.Language',
		},
	],
};

export const manifests: Array<ManifestTypes> = [createManifest];
