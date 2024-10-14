import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';

export const UMB_TEMPLATE_WORKSPACE_ALIAS = 'Umb.Workspace.Template';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'routable',
		alias: 'Umb.Workspace.Template',
		name: 'Template Workspace',
		api: () => import('./template-workspace.context.js'),
		meta: {
			entityType: 'template',
		},
	},
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.Template.Save',
		name: 'Save Template',
		api: UmbSubmitWorkspaceAction,
		weight: 70,
		meta: {
			look: 'primary',
			color: 'positive',
			label: '#buttons_save',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_TEMPLATE_WORKSPACE_ALIAS,
			},
		],
	},
];
