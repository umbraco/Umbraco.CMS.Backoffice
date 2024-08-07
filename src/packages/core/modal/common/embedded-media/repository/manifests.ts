import type { ManifestRepository, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_OEMBED_REPOSITORY_ALIAS = 'Umb.Repository.OEmbed';

const repository: ManifestRepository = {
	type: 'repository',
	alias: UMB_OEMBED_REPOSITORY_ALIAS,
	name: 'OEmbed Repository',
	api: () => import('./oembed.repository.js'),
};

export const manifests: Array<ManifestTypes> = [repository];
