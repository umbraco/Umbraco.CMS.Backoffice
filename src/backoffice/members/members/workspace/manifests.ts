import type {
	ManifestWorkspace,
	ManifestWorkspaceAction,
	ManifestWorkspaceEditorView,
} from '@umbraco-cms/backoffice/extensions-registry';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: 'Umb.Workspace.Member',
	name: 'Member Workspace',
	loader: () => import('./member-workspace.element'),
	meta: {
		entityType: 'member',
	},
};

const workspaceViews: Array<ManifestWorkspaceEditorView> = [];
const workspaceActions: Array<ManifestWorkspaceAction> = [];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
