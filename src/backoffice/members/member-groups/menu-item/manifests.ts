import type { ManifestMenuItem } from '@umbraco-cms/backoffice/models';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.MemberGroups',
	name: 'Member Groups Menu Item',
	weight: 800,
	loader: () => import('./member-groups-menu-item.element'),
	meta: {
		label: 'Member Groups',
		icon: 'umb:folder',
	},
	conditions: {
		menus: ['Umb.Menu.Members'],
	},
};

export const manifests = [menuItem];
