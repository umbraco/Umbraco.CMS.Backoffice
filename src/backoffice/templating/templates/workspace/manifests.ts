import { TEMPLATE_REPOSITORY_ALIAS } from '../repository/manifests';
import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type {
	ManifestWorkspace,
	ManifestWorkspaceAction,
	ManifestWorkspaceView,
} from '@umbraco-cms/backoffice/extensions-registry';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: 'Umb.Workspace.Template',
	name: 'Template Workspace',
	loader: () => import('./template-workspace.element'),
	meta: {
		entityType: 'template',
	},
};

const workspaceViews: Array<ManifestWorkspaceView> = [];

const workspaceActions: Array<ManifestWorkspaceAction> = [
	{
		type: 'workspaceAction',
		alias: 'Umb.WorkspaceAction.Template.Save',
		name: 'Save Template',
		weight: 70,
		meta: {
			look: 'primary',
			color: 'positive',
			label: 'Save',
			api: UmbSaveWorkspaceAction,
		},
		conditions: {
			workspaces: ['Umb.Workspace.Template'],
		},
	},
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
