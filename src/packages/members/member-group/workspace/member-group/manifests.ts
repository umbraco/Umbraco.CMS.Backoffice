import { UMB_MEMBER_GROUP_ENTITY_TYPE } from '../../entity.js';
import type {
	ManifestWorkspaces,
	ManifestWorkspaceActions,
	ManifestWorkspaceView,
} from '@umbraco-cms/backoffice/workspace';
import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';

export const UMB_MEMBER_GROUP_WORKSPACE_ALIAS = 'Umb.Workspace.MemberGroup';

const workspace: ManifestWorkspaces = {
	type: 'workspace',
	kind: 'routable',
	alias: UMB_MEMBER_GROUP_WORKSPACE_ALIAS,
	name: 'MemberGroup Workspace',
	api: () => import('./member-group-workspace.context.js'),
	meta: {
		entityType: UMB_MEMBER_GROUP_ENTITY_TYPE,
	},
};

const workspaceActions: Array<ManifestWorkspaceActions> = [
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.MemberGroup.Save',
		name: 'Save Member Group Workspace Action',
		api: UmbSubmitWorkspaceAction,
		meta: {
			label: '#buttons_save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_MEMBER_GROUP_WORKSPACE_ALIAS,
			},
		],
	},
];

export const workspaceViews: Array<ManifestWorkspaceView> = [
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.Member.Info',
		name: 'Member Workspace info View',
		js: () => import('./views/info/member-type-workspace-view-info.element.js'),
		weight: 300,
		meta: {
			label: '#general_info',
			pathname: 'info',
			icon: 'icon-document',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_MEMBER_GROUP_WORKSPACE_ALIAS,
			},
		],
	},
];

export const manifests: Array<UmbExtensionManifest> = [workspace, ...workspaceActions, ...workspaceViews];
