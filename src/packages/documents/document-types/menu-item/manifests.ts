import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestTypes = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.DocumentTypes',
	name: 'Document Types Menu Item',
	weight: 900,
	meta: {
		treeAlias: 'Umb.Tree.DocumentTypes',
		label: 'Document Types',
		icon: 'icon-folder',
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
