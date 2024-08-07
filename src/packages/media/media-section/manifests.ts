import { UMB_MEDIA_ROOT_ENTITY_TYPE, UMB_MEDIA_MENU_ALIAS } from '../media/index.js';
import type {
	ManifestSection,
	ManifestSectionSidebarApp,
	ManifestTypes,
} from '@umbraco-cms/backoffice/extension-registry';

const sectionAlias = 'Umb.Section.Media';

const section: ManifestSection = {
	type: 'section',
	alias: sectionAlias,
	name: 'Media Section',
	weight: 900,
	meta: {
		label: '#sections_media',
		pathname: 'media',
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionUserPermission',
			match: sectionAlias,
		},
	],
};

const menuSectionSidebarApp: ManifestSectionSidebarApp = {
	type: 'sectionSidebarApp',
	kind: 'menuWithEntityActions',
	alias: 'Umb.SectionSidebarMenu.Media',
	name: 'Media Section Sidebar Menu',
	weight: 100,
	meta: {
		label: '#sections_media',
		menu: UMB_MEDIA_MENU_ALIAS,
		entityType: UMB_MEDIA_ROOT_ENTITY_TYPE,
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionAlias',
			match: sectionAlias,
		},
	],
};

export const manifests: Array<ManifestTypes> = [section, menuSectionSidebarApp];
