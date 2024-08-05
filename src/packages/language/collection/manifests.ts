import { UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS } from './repository/index.js';
import { manifests as collectionRepositoryManifests } from './repository/manifests.js';
import { manifests as collectionViewManifests } from './views/manifests.js';
import { manifests as collectionActionManifests } from './action/manifests.js';
import { UMB_LANGUAGE_COLLECTION_ALIAS, UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS } from './constants.js';
import type {
	ManifestCollection,
	ManifestCollectionSomething,
	ManifestCollectionSomethingItem,
	ManifestTypes,
} from '@umbraco-cms/backoffice/extension-registry';
import { UMB_LANGUAGE_ENTITY_TYPE, UMB_LANGUAGE_ROOT_ENTITY_TYPE } from '../entity.js';

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

const collectionSomethingItemManifest: ManifestCollectionSomethingItem = {
	type: 'collectionSomethingItem',
	kind: 'default',
	alias: 'Umb.CollectionSomethingItem.Language',
	name: 'Language Collection Something Item',
	forEntityTypes: [UMB_LANGUAGE_ROOT_ENTITY_TYPE, UMB_LANGUAGE_ENTITY_TYPE],
};

export const manifests: Array<ManifestTypes> = [
	collectionManifest,
	collectionSomethingManifest,
	collectionSomethingItemManifest,
	...collectionRepositoryManifests,
	...collectionViewManifests,
	...collectionActionManifests,
];
