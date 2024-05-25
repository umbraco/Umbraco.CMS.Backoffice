import type { ManifestRepository, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_DATA_TYPE_COLLECTION_REPOSITORY_ALIAS } from './constants.js';

const repository: ManifestRepository = {
	type: 'repository',
	alias: UMB_DATA_TYPE_COLLECTION_REPOSITORY_ALIAS,
	name: 'Data Type Collection Repository',
	api: () => import('./data-type-collection.repository.js'),
};

export const manifests: Array<ManifestTypes> = [repository];
