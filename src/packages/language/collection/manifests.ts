import { UMB_LANGUAGE_ENTITY_TYPE, UMB_LANGUAGE_ROOT_ENTITY_TYPE } from '../entity.js';
import { manifests as collectionActionManifests } from './action/manifests.js';
import { manifests as collectionRepositoryManifests } from './repository/manifests.js';
import { manifests as collectionViewManifests } from './views/manifests.js';
import { UMB_LANGUAGE_COLLECTION_ALIAS, UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS } from './constants.js';
import { UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS } from './repository/index.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'collection',
		kind: 'default',
		alias: UMB_LANGUAGE_COLLECTION_ALIAS,
		name: 'Language Collection',
		meta: {
			repositoryAlias: UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS,
		},
	},
	{
		type: 'collectionSomething',
		kind: 'default',
		alias: UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS,
		name: 'Language Collection Something',
		meta: {
			repositoryAlias: UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS,
		},
	},
	{
		type: 'collectionSomethingItem',
		kind: 'default',
		alias: 'Umb.CollectionSomethingItem.Language',
		name: 'Language Collection Something Item',
		forEntityTypes: [UMB_LANGUAGE_ROOT_ENTITY_TYPE, UMB_LANGUAGE_ENTITY_TYPE],
	},
	...collectionActionManifests,
	...collectionRepositoryManifests,
	...collectionViewManifests,
];
