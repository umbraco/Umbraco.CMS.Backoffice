import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.Dictionary',
	name: 'Dictionary Menu Item',
	weight: 400,
	loader: () => import('./dictionary-menu-item.element.js'),
	meta: {
		label: 'Dictionary',
		icon: 'icon-book-alt',
		entityType: 'dictionary-item',
		menus: ['Umb.Menu.Dictionary'],
	},
};

export const manifests = [menuItem];
