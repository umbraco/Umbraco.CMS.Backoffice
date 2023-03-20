import type { ManifestMenuItem } from '@umbraco-cms/backoffice/models';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.Media',
	name: 'Media Menu Item',
	weight: 100,
	loader: () => import('./media-menu-item.element'),
	meta: {
		label: 'Media',
		icon: 'umb:folder',
	},
	conditions: {
		menus: ['Umb.Menu.Media'],
	},
};

export const manifests = [menuItem];
