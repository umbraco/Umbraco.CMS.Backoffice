import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'menuItem',
		alias: 'Umb.MenuItem.Languages',
		name: 'Languages Menu Item',
		weight: 100,
		meta: {
			label: '#treeHeaders_languages',
			icon: 'icon-globe',
			entityType: 'language-root',
			menus: ['Umb.Menu.StructureSettings'],
		},
	},
	{
		type: 'workspaceContext',
		name: 'Language Menu Structure Workspace Context',
		alias: 'Umb.Context.Language.Menu.Structure',
		api: () => import('./language-menu-structure.context.js'),
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: 'Umb.Workspace.Language',
			},
		],
	},
	{
		type: 'workspaceFooterApp',
		kind: 'menuBreadcrumb',
		alias: 'Umb.WorkspaceFooterApp.Language.Breadcrumb',
		name: 'Language Breadcrumb Workspace Footer App',
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: 'Umb.Workspace.Language',
			},
		],
	},
];
