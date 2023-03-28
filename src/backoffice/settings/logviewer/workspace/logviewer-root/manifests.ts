import type {
	ManifestWorkspace,
	ManifestWorkspaceAction,
	ManifestWorkspaceView,
} from '@umbraco-cms/backoffice/extensions-registry';

const workspaceAlias = 'Umb.Workspace.LogviewerRoot';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: workspaceAlias,
	name: 'LogViewer Root Workspace',
	loader: () => import('./logviewer-root-workspace.element'),
	meta: {
		entityType: 'logviewer',
	},
};

const workspaceViews: Array<ManifestWorkspaceView> = [
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Logviewer.Overview',
		name: 'LogViewer Root Workspace Overview View',
		loader: () => import('../views/overview/index'),
		weight: 300,
		meta: {
			label: 'Overview',
			pathname: 'overview',
			icon: 'umb:box-alt',
		},
		conditions: {
			workspaces: [workspaceAlias],
		},
	},
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Logviewer.Search',
		name: 'LogViewer Root Workspace Search View',
		loader: () => import('../views/search/index'),
		weight: 200,
		meta: {
			label: 'Search',
			pathname: 'search',
			icon: 'umb:search',
		},
		conditions: {
			workspaces: [workspaceAlias],
		},
	},
];

const workspaceActions: Array<ManifestWorkspaceAction> = [];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
