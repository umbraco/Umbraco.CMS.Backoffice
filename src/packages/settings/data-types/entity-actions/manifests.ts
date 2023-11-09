import { DATA_TYPE_FOLDER_ENTITY_TYPE, DATA_TYPE_ENTITY_TYPE } from '../entities.js';
import { DATA_TYPE_REPOSITORY_ALIAS } from '../repository/manifests.js';
import { manifests as createManifests } from './create/manifests.js';
import { manifests as moveManifests } from './move/manifests.js';
import { manifests as copyManifests } from './copy/manifests.js';

import {
	UmbDeleteEntityAction,
	UmbDeleteFolderEntityAction,
	UmbFolderUpdateEntityAction,
} from '@umbraco-cms/backoffice/entity-action';
import { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.DataType.Delete',
		name: 'Delete Data Type Entity Action',
		weight: 900,
		api: UmbDeleteEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete...',
			repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
			entityTypes: [DATA_TYPE_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.DataType.DeleteFolder',
		name: 'Delete Data Type Folder Entity Action',
		weight: 800,
		api: UmbDeleteFolderEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete Folder...',
			repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
			entityTypes: [DATA_TYPE_ENTITY_TYPE, DATA_TYPE_FOLDER_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.DataType.RenameFolder',
		name: 'Rename Data Type Folder Entity Action',
		weight: 700,
		api: UmbFolderUpdateEntityAction,
		meta: {
			icon: 'icon-edit',
			label: 'Rename Folder...',
			repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
			entityTypes: [DATA_TYPE_ENTITY_TYPE, DATA_TYPE_FOLDER_ENTITY_TYPE],
		},
	},
];

export const manifests = [...entityActions, ...createManifests, ...moveManifests, ...copyManifests];
