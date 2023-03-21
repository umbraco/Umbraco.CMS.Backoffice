import type { ManifestDashboard, ManifestSection, ManifestTypes } from '@umbraco-cms/backoffice/extensions-registry';

const sectionAlias = 'Umb.Section.Members';

const section: ManifestSection = {
	type: 'section',
	alias: sectionAlias,
	name: 'Members Section',
	weight: 400,
	meta: {
		label: 'Members',
		pathname: 'members',
	},
};

const dashboards: Array<ManifestDashboard> = [
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.Members',
		name: 'Members Dashboard',
		weight: 10,
		loader: () => import('./dashboards/welcome/dashboard-members-welcome.element'),
		meta: {
			label: 'Members',
			pathname: 'members',
		},
		conditions: {
			sections: [sectionAlias],
		},
	},
];

const menuSectionSidebarApp: ManifestTypes = {
	type: 'sectionSidebarApp',
	kind: 'menu',
	alias: 'Umb.SectionSidebarMenu.Members',
	name: 'Members Section Sidebar Menu',
	weight: 100,
	meta: {
		label: 'Members',
		menu: 'Umb.Menu.Members',
	},
	conditions: {
		sections: [sectionAlias],
	},
};

export const manifests = [section, menuSectionSidebarApp, ...dashboards];
