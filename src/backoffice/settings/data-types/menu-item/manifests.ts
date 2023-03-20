import type { ManifestMenuItem } from '@umbraco-cms/backoffice/models';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.DataTypes',
	name: 'Data Types Menu Item',
	weight: 40,
	loader: () => import('./data-types-menu-item.element'),
	meta: {
		label: 'Data Types',
		icon: 'umb:folder',
		entityType: 'data-type',
	},
	conditions: {
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
