import { ManifestSectionSidebarAppMenuKind } from '@umbraco-cms/extensions-registry';
import type { ManifestSection } from '@umbraco-cms/models';

const sectionAlias = 'Umb.Section.Settings';

const section: ManifestSection = {
	type: 'section',
	alias: sectionAlias,
	name: 'Settings Section',
	weight: 300,
	meta: {
		label: 'Settings',
		pathname: 'settings',
	},
};

const menuSectionSidebarApp: ManifestSectionSidebarAppMenuKind = {
	type: 'sectionSidebarApp',
	kind: 'menu',
	alias: 'Umb.SectionSidebarMenu.Settings',
	name: 'Settings Section Sidebar Menu',
	weight: 100,
	meta: {
		label: 'Settings',
		menu: 'Umb.Menu.Settings',
	},
	conditions: {
		sections: [sectionAlias],
	},
};

export const manifests = [section, menuSectionSidebarApp];
