import { UMB_MEDIA_TYPE_FOLDER_ENTITY_TYPE } from '../../entity.js';
import type { ManifestEntityAction, ManifestRepository } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_MEDIA_TYPE_FOLDER_REPOSITORY_ALIAS = 'Umb.Repository.MediaType.Folder';

const folderRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_MEDIA_TYPE_FOLDER_REPOSITORY_ALIAS,
	name: 'Media Type Folder Repository',
	api: () => import('./media-type-folder.repository.js'),
};

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		kind: 'folderUpdate',
		alias: 'Umb.EntityAction.MediaType.Folder.Update',
		name: 'Rename Media Type Folder Entity Action',
		forEntityTypes: [UMB_MEDIA_TYPE_FOLDER_ENTITY_TYPE],
		meta: {
			folderRepositoryAlias: UMB_MEDIA_TYPE_FOLDER_REPOSITORY_ALIAS,
		},
	},
	{
		type: 'entityAction',
		kind: 'folderDelete',
		alias: 'Umb.EntityAction.MediaType.Folder.Delete',
		name: 'Delete Media Type Folder Entity Action',
		forEntityTypes: [UMB_MEDIA_TYPE_FOLDER_ENTITY_TYPE],
		meta: {
			folderRepositoryAlias: UMB_MEDIA_TYPE_FOLDER_REPOSITORY_ALIAS,
		},
	},
];

export const manifests = [folderRepository, ...entityActions];
