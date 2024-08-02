import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

const defaultCollectionSomethingKind: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.CollectionSomething.Default',
	matchKind: 'default',
	matchType: 'collectionSomething',
	manifest: {
		type: 'collectionSomething',
		api: () => import('./default-collection-something.context.js'),
		element: () => import('./default-collection-something.element.js'),
	},
};

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [defaultCollectionSomethingKind];
