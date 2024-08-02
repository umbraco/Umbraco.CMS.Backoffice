import { UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS } from '../collection/index.js';
import type { ManifestKind } from '@umbraco-cms/backoffice/extension-api';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | ManifestKind<ManifestTypes>> = [
	{
		type: 'menuItem',
		kind: 'collection',
		alias: 'Umb.MenuItem.Languages',
		name: 'Languages Menu Item',
		weight: 100,
		meta: {
			label: '#treeHeaders_languages',
			icon: 'icon-globe',
			entityType: 'language-root',
			menus: ['Umb.Menu.StructureSettings'],
			collectionSomethingAlias: UMB_LANGUAGE_COLLECTION_SOMETHING_ALIAS,
		},
	},
	{
		type: 'workspaceContext',
		name: 'Language Menu Structure Workspace Context',
		alias: 'Umb.Context.Language.Menu.Structure',
		api: () => import('./language-menu-structure.context.js'),
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
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
				alias: 'Umb.Condition.WorkspaceAlias',
				match: 'Umb.Workspace.Language',
			},
		],
	},
];
