import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

const kind: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.CollectionSomethingItem.Default',
	matchKind: 'default',
	matchType: 'collectionSomethingItem',
	manifest: {
		type: 'collectionSomethingItem',
		api: () => import('./collection-something-item-default.context.js'),
		element: () => import('./collection-something-item-default.element.js'),
	},
};

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [kind];
