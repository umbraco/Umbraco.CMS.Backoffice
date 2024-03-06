import { UMB_STYLESHEET_ENTITY_TYPE } from '../entity.js';
import { UMB_STYLESHEET_DETAIL_REPOSITORY_ALIAS, UMB_STYLESHEET_ITEM_REPOSITORY_ALIAS } from '../repository/index.js';
import { manifests as createManifests } from './create/manifests.js';
import { manifests as renameManifests } from './rename/manifests.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const stylesheetActions: Array<ManifestTypes> = [
	{
		type: 'entityAction',
		kind: 'delete',
		alias: 'Umb.EntityAction.Stylesheet.Delete',
		name: 'Delete Stylesheet Entity Action',
		forEntityTypes: [UMB_STYLESHEET_ENTITY_TYPE],
		meta: {
			detailRepositoryAlias: UMB_STYLESHEET_DETAIL_REPOSITORY_ALIAS,
			itemRepositoryAlias: UMB_STYLESHEET_ITEM_REPOSITORY_ALIAS,
		},
	},
];

export const manifests = [...stylesheetActions, ...createManifests, ...renameManifests];
