import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type {
	ManifestWorkspace,
	ManifestWorkspaceAction,
	ManifestWorkspaceEditorView,
} from '@umbraco-cms/backoffice/extension-registry';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: 'Umb.Workspace.DocumentType',
	name: 'Document Type Workspace',
	loader: () => import('./document-type-workspace.element.js'),
	meta: {
		entityType: 'document-type',
	},
};

const workspaceEditorViews: Array<ManifestWorkspaceEditorView> = [
	{
		type: 'workspaceEditorView',
		alias: 'Umb.WorkspaceView.DocumentType.Design',
		name: 'Document Type Workspace Design View',
		loader: () => import('./views/design/document-type-workspace-view-edit.element.js'),
		weight: 1000,
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
		type: 'workspaceEditorView',
		alias: 'Umb.WorkspaceView.DocumentType.Structure',
		name: 'Document Type Workspace Structure View',
		loader: () => import('./views/structure/document-type-workspace-view-structure.element.js'),
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
	{
		type: 'workspaceEditorView',
		alias: 'Umb.WorkspaceView.DocumentType.Settings',
		name: 'Document Type Workspace Settings View',
		loader: () => import('./views/settings/document-type-workspace-view-settings.element.js'),
		weight: 600,
		meta: {
			label: 'Settings',
			pathname: 'settings',
			icon: 'icon-settings',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: workspace.alias,
			},
		],
	},
	{
		type: 'workspaceEditorView',
		alias: 'Umb.WorkspaceView.DocumentType.Templates',
		name: 'Document Type Workspace Templates View',
		loader: () => import('./views/templates/document-type-workspace-view-templates.element.js'),
		weight: 400,
		meta: {
			label: 'Templates',
			pathname: 'templates',
			icon: 'icon-layout',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: workspace.alias,
			},
		],
	},
];

const workspaceActions: Array<ManifestWorkspaceAction> = [
	{
		type: 'workspaceAction',
		alias: 'Umb.WorkspaceAction.DocumentType.Save',
		name: 'Save Document Type Workspace Action',
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

export const manifests = [workspace, ...workspaceEditorViews, ...workspaceActions];
