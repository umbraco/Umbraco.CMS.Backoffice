import type { ManifestTypes } from '@umbraco-cms/backoffice/extensions-registry';

const menuItem: ManifestTypes = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.DataTypes',
	name: 'Data Types Menu Item',
	weight: 40,
	meta: {
		label: 'Data Types',
		icon: 'umb:folder',
		entityType: 'data-type-root',
		treeAlias: 'Umb.Tree.DataTypes',
	},
	conditions: {
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
