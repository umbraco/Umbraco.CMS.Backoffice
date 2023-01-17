import type { ManifestSidebarMenuItem } from '@umbraco-cms/models';

const sidebarMenuItem: ManifestSidebarMenuItem = {
	type: 'sidebarMenuItem',
	alias: 'Umb.SidebarMenuItem.Stylesheets',
	name: 'Stylesheets Sidebar Menu Item',
	weight: 40,
	loader: () => import('./stylesheets-sidebar-menu-item.element'),
	meta: {
		label: 'Stylesheets',
		icon: 'umb:folder',
		sections: ['Umb.Section.Settings'],
		entityType: 'data-type',
	},
};

export const manifests = [sidebarMenuItem];
