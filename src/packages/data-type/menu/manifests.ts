import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'menuItem',
		kind: 'tree',
		alias: 'Umb.MenuItem.DataTypes',
		name: 'Data Types Menu Item',
		weight: 600,
		meta: {
			label: 'Data Types',
			entityType: 'data-type',
			treeAlias: 'Umb.Tree.DataType',
			menus: ['Umb.Menu.StructureSettings'],
		},
	},
	{
		type: 'workspaceContext',
		name: 'Data Type Menu Structure Workspace Context',
		alias: 'Umb.Context.DataType.Menu.Structure',
		api: () => import('./data-type-menu-structure.context.js'),
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: 'Umb.Workspace.DataType',
			},
		],
	},
	{
		type: 'workspaceFooterApp',
		kind: 'menuBreadcrumb',
		alias: 'Umb.WorkspaceFooterApp.DataType.Breadcrumb',
		name: 'Data Type Breadcrumb Workspace Footer App',
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: 'Umb.Workspace.DataType',
			},
		],
	},
];
