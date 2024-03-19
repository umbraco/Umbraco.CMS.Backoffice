import { UMB_PARTIAL_VIEW_FOLDER_ENTITY_TYPE } from '../../entity.js';
import { UmbPartialViewFolderRepository } from './partial-view-folder.repository.js';
import type { ManifestRepository } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_PARTIAL_VIEW_FOLDER_REPOSITORY_ALIAS = 'Umb.Repository.PartialView.Folder';

const folderRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_PARTIAL_VIEW_FOLDER_REPOSITORY_ALIAS,
	name: 'Partial View Folder Repository',
	api: UmbPartialViewFolderRepository,
};

export const UMB_DELETE_PARTIAL_VIEW_FOLDER_ENTITY_ACTION_ALIAS = 'Umb.EntityAction.PartialView.Folder.Delete';

const entityActions = [
	{
		type: 'entityAction',
		kind: 'folderDelete',
		alias: UMB_DELETE_PARTIAL_VIEW_FOLDER_ENTITY_ACTION_ALIAS,
		name: 'Delete Partial View folder Entity Action',
		forEntityTypes: [UMB_PARTIAL_VIEW_FOLDER_ENTITY_TYPE],
		meta: {
			folderRepositoryAlias: UMB_PARTIAL_VIEW_FOLDER_REPOSITORY_ALIAS,
		},
	},
];

export const manifests = [folderRepository, ...entityActions];
