import {
	UMB_DOCUMENT_BLUEPRINT_ENTITY_TYPE,
	UMB_DOCUMENT_BLUEPRINT_FOLDER_ENTITY_TYPE,
	UMB_DOCUMENT_BLUEPRINT_ROOT_ENTITY_TYPE,
} from '../entity.js';
import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';

export const UMB_DOCUMENT_BLUEPRINT_WORKSPACE_ALIAS = 'Umb.Workspace.DocumentBlueprint';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'routable',
		alias: UMB_DOCUMENT_BLUEPRINT_WORKSPACE_ALIAS,
		name: 'Document Blueprint Workspace',
		api: () => import('./document-blueprint-workspace.context.js'),
		meta: {
			entityType: UMB_DOCUMENT_BLUEPRINT_ENTITY_TYPE,
		},
	},
	{
		type: 'workspace',
		alias: 'Umb.Workspace.DocumentBlueprint.Root',
		name: 'Document Blueprint Root Workspace',
		element: () => import('./document-blueprint-root-workspace.element.js'),
		meta: {
			entityType: UMB_DOCUMENT_BLUEPRINT_ROOT_ENTITY_TYPE,
		},
	},
	{
		type: 'workspace',
		alias: 'Umb.Workspace.DocumentBlueprint.Folder',
		name: 'Document Blueprint Folder Workspace',
		element: () => import('./document-blueprint-root-workspace.element.js'),
		meta: {
			entityType: UMB_DOCUMENT_BLUEPRINT_FOLDER_ENTITY_TYPE,
		},
	},
	{
		type: 'workspaceView',
		kind: 'contentEditor',
		alias: 'Umb.WorkspaceView.DocumentBlueprint.Edit',
		name: 'Document Blueprint Workspace Edit View',
		weight: 200,
		meta: {
			label: '#general_content',
			pathname: 'content',
			icon: 'document',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: UMB_DOCUMENT_BLUEPRINT_WORKSPACE_ALIAS,
			},
		],
	},

	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.DocumentBlueprint.Save',
		name: 'Save Document Workspace Action',
		weight: 80,
		api: UmbSubmitWorkspaceAction,
		meta: {
			label: 'Save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: UMB_DOCUMENT_BLUEPRINT_WORKSPACE_ALIAS,
			},
		],
	},
];
