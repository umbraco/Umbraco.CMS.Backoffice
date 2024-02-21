import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.Extensions',
	name: 'Extensions Menu Item',
	weight: 0,
	meta: {
		label: 'Extensions',
		icon: 'icon-wand',
		entityType: 'extension-root',
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
