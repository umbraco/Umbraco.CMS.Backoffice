import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type {
	ManifestWorkspaces,
	ManifestWorkspaceActions,
	ManifestWorkspaceView,
} from '@umbraco-cms/backoffice/extension-registry';

const DATA_TYPE_WORKSPACE_ALIAS = 'Umb.Workspace.DataType';

const workspace: ManifestWorkspaces = {
	type: 'workspace',
	kind: 'routable',
	alias: DATA_TYPE_WORKSPACE_ALIAS,
	name: 'Data Type Workspace',
	api: () => import('./data-type-workspace.context.js'),
	meta: {
		entityType: 'data-type',
	},
};

const workspaceViews: Array<ManifestWorkspaceView> = [
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.DataType.Edit',
		name: 'Data Type Workspace Edit View',
		js: () => import('./views/details/data-type-details-workspace-view.element.js'),
		weight: 90,
		meta: {
			label: 'Details',
			pathname: 'details',
			icon: 'edit',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: workspace.alias,
			},
		],
	},
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.DataType.Info',
		name: 'Data Type Workspace Info View',
		js: () => import('./views/info/workspace-view-data-type-info.element.js'),
		weight: 90,
		meta: {
			label: 'Info',
			pathname: 'info',
			icon: 'info',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: workspace.alias,
			},
		],
	},
];

const workspaceActions: Array<ManifestWorkspaceActions> = [
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.DataType.Save',
		name: 'Save Data Type Workspace Action',
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

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
