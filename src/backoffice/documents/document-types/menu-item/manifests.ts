import type { ManifestTypes } from '@umbraco-cms/models';

const menuItem: ManifestTypes = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.DocumentTypes',
	name: 'Document Types Menu Item',
	weight: 10,
	meta: {
		treeAlias: 'Umb.Tree.DocumentTypes',
		label: 'Document Types',
		icon: 'umb:folder',
	},
	conditions: {
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
