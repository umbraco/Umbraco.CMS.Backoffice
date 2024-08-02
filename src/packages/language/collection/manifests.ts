import { UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS } from './repository/index.js';
import { manifests as collectionRepositoryManifests } from './repository/manifests.js';
import { manifests as collectionViewManifests } from './views/manifests.js';
import { manifests as collectionActionManifests } from './action/manifests.js';
import { UMB_LANGUAGE_COLLECTION_ALIAS, UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS } from './constants.js';
import type {
	ManifestCollection,
	ManifestCollectionSomething,
	ManifestTypes,
} from '@umbraco-cms/backoffice/extension-registry';

const collectionManifest: ManifestCollection = {
	type: 'collection',
	kind: 'default',
	alias: UMB_LANGUAGE_COLLECTION_ALIAS,
	name: 'Language Collection',
	meta: {
		repositoryAlias: UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS,
	},
};

const collectionSomethingManifest: ManifestCollectionSomething = {
	type: 'collectionSomething',
	kind: 'default',
	alias: UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS,
	name: 'Language Collection Something',
	meta: {
		repositoryAlias: UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS,
	},
};

export const manifests: Array<ManifestTypes> = [
	collectionManifest,
	collectionSomethingManifest,
	...collectionRepositoryManifests,
	...collectionViewManifests,
	...collectionActionManifests,
];
