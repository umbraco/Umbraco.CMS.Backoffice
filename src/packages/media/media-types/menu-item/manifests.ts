import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestTypes = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'Umb.MenuItem.MediaTypes',
	name: 'Media Types Menu Item',
	weight: 800,
	meta: {
		label: 'Media Types',
		icon: 'icon-folder',
		treeAlias: 'Umb.Tree.MediaTypes',
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
