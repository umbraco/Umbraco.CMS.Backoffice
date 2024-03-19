import type {
	ManifestWorkspace,
	ManifestWorkspaceActions,
	ManifestWorkspaceViews,
} from '@umbraco-cms/backoffice/extension-registry';

import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';

export const UMB_MEDIA_TYPE_WORKSPACE_ALIAS = 'Umb.Workspace.MediaType';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: UMB_MEDIA_TYPE_WORKSPACE_ALIAS,
	name: 'Media Type Workspace',
	js: () => import('./media-type-workspace.element.js'),
	meta: {
		entityType: 'media-type',
	},
};

const workspaceViews: Array<ManifestWorkspaceViews> = [
	{
		type: 'workspaceView',
		kind: 'contentTypeDesignEditor',
		alias: 'Umb.WorkspaceView.MediaType.Design',
		name: 'Media Type Workspace Design View',
		meta: {
			label: 'Design',
			pathname: 'design',
			icon: 'icon-document-dashed-line',
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
		alias: 'Umb.WorkspaceView.MediaType.Structure',
		name: 'Media Type Workspace Structure View',
		js: () => import('./views/structure/media-type-workspace-view-structure.element.js'),
		weight: 800,
		meta: {
			label: 'Structure',
			pathname: 'structure',
			icon: 'icon-mindmap',
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
		alias: 'Umb.WorkspaceAction.MediaType.Save',
		name: 'Save Media Type Workspace Action',
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
