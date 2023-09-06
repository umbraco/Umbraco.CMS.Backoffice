import type { ManifestDashboard, ManifestSection, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const sectionAlias = 'Umb.Section.Dictionary';

const section: ManifestSection = {
	type: 'section',
	alias: sectionAlias,
	name: 'Dictionary Section',
	weight: 100,
	meta: {
		label: 'Dictionary',
		pathname: 'dictionary',
	},
};

const menuSectionSidebarApp: ManifestTypes = {
	type: 'sectionSidebarApp',
	kind: 'menu',
	alias: 'Umb.SidebarMenu.Dictionary',
	name: 'Dictionary Sidebar Menu',
	weight: 100,
	meta: {
		label: 'Dictionary',
		menu: 'Umb.Menu.Dictionary',
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionAlias',
			match: sectionAlias,
		},
	],
};

const dashboards: Array<ManifestDashboard> = [
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.LocalizationDictionary',
		name: 'Dictionary localization Dashboard',
		elementName: 'umb-dashboard-translation-dictionary',
		loader: () => import('./dashboards/dictionary/dashboard-localization-dictionary.element.js'),
		meta: {
			label: 'Dictionary overview',
			pathname: '',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: sectionAlias,
			},
		],
	},
];

export const manifests = [section, menuSectionSidebarApp, ...dashboards];
