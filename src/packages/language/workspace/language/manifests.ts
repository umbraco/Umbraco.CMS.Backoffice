import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type {
	ManifestWorkspaces,
	ManifestWorkspaceActions,
	ManifestWorkspaceView,
} from '@umbraco-cms/backoffice/extension-registry';

const workspace: ManifestWorkspaces = {
	type: 'workspace',
	kind: 'routable',
	alias: 'Umb.Workspace.Language',
	name: 'Language Workspace',
	api: () => import('./language-workspace.context.js'),
	meta: {
		entityType: 'language',
	},
};

const workspaceViews: Array<ManifestWorkspaceView> = [
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Language.Details',
		name: 'Language Workspace Details View',
		js: () => import('./views/language-details-workspace-view.element.js'),
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
];

const workspaceActions: Array<ManifestWorkspaceActions> = [
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.Language.Save',
		name: 'Save Language Workspace Action',
		api: UmbSaveWorkspaceAction,
		meta: {
			look: 'primary',
			color: 'positive',
			label: 'Save',
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
