import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';
import { UMB_DICTIONARY_ENTITY_TYPE } from '../entity.js';
import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';

export const UMB_DICTIONARY_WORKSPACE_ALIAS = 'Umb.Workspace.Dictionary';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'routable',
		alias: UMB_DICTIONARY_WORKSPACE_ALIAS,
		name: 'Dictionary Workspace',
		api: () => import('./dictionary-workspace.context.js'),
		meta: {
			entityType: UMB_DICTIONARY_ENTITY_TYPE,
		},
	},
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Dictionary.Edit',
		name: 'Dictionary Workspace Edit View',
		element: () => import('./views/workspace-view-dictionary-editor.element.js'),
		weight: 100,
		meta: {
			label: '#general_edit',
			pathname: 'edit',
			icon: 'edit',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_DICTIONARY_WORKSPACE_ALIAS,
			},
		],
	},
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.Dictionary.Save',
		name: 'Save Dictionary Workspace Action',
		weight: 90,
		api: UmbSubmitWorkspaceAction,
		meta: {
			label: '#buttons_save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_DICTIONARY_WORKSPACE_ALIAS,
			},
		],
	},
];
