import { UMB_SCRIPT_ENTITY_TYPE } from '../entity.js';
import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type { ManifestWorkspaces, ManifestWorkspaceActions } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_SCRIPT_WORKSPACE_ALIAS = 'Umb.Workspace.Script';
export const UMB_SAVE_SCRIPT_WORKSPACE_ACTION_ALIAS = 'Umb.WorkspaceAction.Script.Save';

const workspace: ManifestWorkspaces = {
	type: 'workspace',
	kind: 'routable',
	alias: UMB_SCRIPT_WORKSPACE_ALIAS,
	name: 'Script Workspace',
	api: () => import('./script-workspace.context.js'),
	meta: {
		entityType: UMB_SCRIPT_ENTITY_TYPE,
	},
};

const workspaceActions: Array<ManifestWorkspaceActions> = [
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: UMB_SAVE_SCRIPT_WORKSPACE_ACTION_ALIAS,
		name: 'Save Script Workspace Action',
		api: UmbSaveWorkspaceAction,
		meta: {
			label: 'Save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: workspace.alias,
			},
		],
	},
];

export const manifests = [workspace, ...workspaceActions];
