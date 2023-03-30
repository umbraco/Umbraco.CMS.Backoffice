import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extensions-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.LogViewer',
	name: 'LogViewer Menu Item',
	weight: 300,
	meta: {
		label: 'Log Viewer',
		icon: 'umb:box-alt',
		entityType: 'logviewer',
	},
	conditions: {
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
