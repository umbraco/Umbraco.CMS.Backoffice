import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.LogViewer',
	name: 'LogViewer Menu Item',
	weight: 300,
	meta: {
		label: 'Log Viewer',
		icon: 'icon-box-alt',
		entityType: 'logviewer',
		menus: ['Umb.Menu.Settings'],
	},
};

export const manifests = [menuItem];
