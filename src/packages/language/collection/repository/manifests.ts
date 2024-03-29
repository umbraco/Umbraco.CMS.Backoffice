import type { ManifestRepository } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS = 'Umb.Repository.LanguageCollection';

const repository: ManifestRepository = {
	type: 'repository',
	alias: UMB_LANGUAGE_COLLECTION_REPOSITORY_ALIAS,
	name: 'Language Collection Repository',
	api: () => import('./language-collection.repository.js'),
};

export const manifests = [repository];
