import { UMB_PROPERTY_TYPE_ENTITY_TYPE, UMB_PROPERTY_TYPE_WORKSPACE_ALIAS, UMB_WORKSPACE_ALIAS_CONDITION } from './constants.js';
import { UmbSubmitWorkspaceAction } from '@umbraco-cms/backoffice/workspace';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'routable',
		name: 'Property Type Workspace',
		alias: UMB_PROPERTY_TYPE_WORKSPACE_ALIAS,
		api: () => import('./property-type-workspace.context.js'),
		meta: {
			entityType: UMB_PROPERTY_TYPE_ENTITY_TYPE,
		},
	},
	{
		type: 'workspaceView',
		alias: 'Umb.WorkspaceView.PropertyType.Settings',
		name: 'Property Type Settings Workspace View',
		element: () => import('./views/settings/property-workspace-view-settings.element.js'),
		weight: 1000,
		meta: {
			label: '#general_content',
			pathname: 'content',
			icon: 'icon-document',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_PROPERTY_TYPE_WORKSPACE_ALIAS,
			},
		],
	},
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.PropertyType.Submit',
		name: 'Submit Property Type Workspace Action',
		api: UmbSubmitWorkspaceAction,
		meta: {
			label: '#general_submit',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				oneOf: [UMB_PROPERTY_TYPE_WORKSPACE_ALIAS],
			},
		],
	},
];
