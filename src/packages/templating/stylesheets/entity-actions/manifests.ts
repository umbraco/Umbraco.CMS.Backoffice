import {
	UMB_STYLESHEET_ENTITY_TYPE,
	UMB_STYLESHEET_FOLDER_ENTITY_TYPE,
	UMB_STYLESHEET_ROOT_ENTITY_TYPE,
} from '../entity.js';

import { UMB_STYLESHEET_REPOSITORY_ALIAS } from '../repository/index.js';
import { UmbCreateRTFStylesheetAction } from './create/create-rtf.action.js';
import { UmbCreateStylesheetAction } from './create/create.action.js';
import {
	UmbCreateFolderEntityAction,
	UmbDeleteEntityAction,
	UmbDeleteFolderEntityAction,
} from '@umbraco-cms/backoffice/entity-action';
import { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';

const stylesheetActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Stylesheet.Delete',
		name: 'Delete Stylesheet Entity Action',
		api: UmbDeleteEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete',
			repositoryAlias: UMB_STYLESHEET_REPOSITORY_ALIAS,
			entityTypes: [UMB_STYLESHEET_ENTITY_TYPE],
		},
	},
];

//Actions for directories
const stylesheetFolderActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Stylesheet.Folder.Create',
		name: 'Create Stylesheet Entity Under Directory Action',
		api: UmbCreateStylesheetAction,
		meta: {
			icon: 'icon-script',
			label: 'New stylesheet file',
			repositoryAlias: UMB_STYLESHEET_REPOSITORY_ALIAS,
			entityTypes: [UMB_STYLESHEET_FOLDER_ENTITY_TYPE, UMB_STYLESHEET_ROOT_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Stylesheet.Folder.Create.RTF',
		name: 'Create RTF Stylesheet Entity Under Directory Action',
		api: UmbCreateRTFStylesheetAction,
		meta: {
			icon: 'icon-script',
			label: 'New Rich Text Editor style sheet file',
			repositoryAlias: UMB_STYLESHEET_REPOSITORY_ALIAS,
			entityTypes: [UMB_STYLESHEET_FOLDER_ENTITY_TYPE, UMB_STYLESHEET_ROOT_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Stylesheet.Folder.Delete',
		name: 'Delete Stylesheet folder',
		api: UmbDeleteFolderEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete folder....',
			repositoryAlias: UMB_STYLESHEET_REPOSITORY_ALIAS,
			entityTypes: [UMB_STYLESHEET_FOLDER_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Stylesheet.Folder.Create',
		name: 'Create Stylesheet folder',
		api: UmbCreateFolderEntityAction,
		meta: {
			icon: 'icon-add',
			label: 'Create folder...',
			repositoryAlias: UMB_STYLESHEET_REPOSITORY_ALIAS,
			entityTypes: [UMB_STYLESHEET_FOLDER_ENTITY_TYPE, UMB_STYLESHEET_ROOT_ENTITY_TYPE],
		},
	},
];

export const manifests = [...stylesheetActions, ...stylesheetFolderActions];
