import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';

export const UMB_PARTIAL_VIEW_WORKSPACE_ALIAS = 'Umb.Workspace.PartialView';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'routable',
		alias: UMB_PARTIAL_VIEW_WORKSPACE_ALIAS,
		name: 'Partial View Workspace',
		api: () => import('./partial-view-workspace.context.js'),
		meta: {
			entityType: 'partial-view',
		},
	},
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.PartialView.Save',
		name: 'Save Partial View',
		api: UmbSubmitWorkspaceAction,
		meta: {
			label: '#buttons_save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_PARTIAL_VIEW_WORKSPACE_ALIAS,
			},
		],
	},
];
