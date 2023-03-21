import type { ManifestTypes } from '@umbraco-cms/backoffice/models';

const menuItem: ManifestTypes = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.Templates',
	name: 'Templates Menu Item',
	weight: 40,
	meta: {
		label: 'Templates',
		icon: 'umb:folder',
		entityType: 'template',
		treeAlias: 'Umb.Tree.Templates',
	},
	conditions: {
		menus: ['Umb.Menu.Templating'],
	},
};

export const manifests = [menuItem];
