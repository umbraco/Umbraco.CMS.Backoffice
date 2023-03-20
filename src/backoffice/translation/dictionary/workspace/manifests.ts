import { DICTIONARY_REPOSITORY_ALIAS } from '../repository/manifests';
import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type { ManifestWorkspace, ManifestWorkspaceAction, ManifestWorkspaceView } from '@umbraco-cms/backoffice/models';

const workspaceAlias = 'Umb.Workspace.Dictionary';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: workspaceAlias,
	name: 'Dictionary Workspace',
	loader: () => import('./dictionary-workspace.element'),
	meta: {
		entityType: 'dictionary-item',
	},
};

const workspaceViews: Array<ManifestWorkspaceView> = [
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Dictionary.Edit',
		name: 'Dictionary Workspace Edit View',
		loader: () => import('./views/edit/workspace-view-dictionary-edit.element'),
		weight: 100,
		meta: {
			label: 'Edit',
			pathname: 'edit',
			icon: 'edit',
		},
		conditions: {
			workspaces: [workspaceAlias],
		},
	},
];

const workspaceActions: Array<ManifestWorkspaceAction> = [
	{
		type: 'workspaceAction',
		alias: 'Umb.WorkspaceAction.Dictionary.Save',
		name: 'Save Dictionary Workspace Action',
		weight: 90,
		meta: {
			label: 'Save',
			look: 'primary',
			color: 'positive',
			api: UmbSaveWorkspaceAction,
		},
		conditions: {
			workspaces: ['Umb.Workspace.Dictionary'],
		},
	},
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
