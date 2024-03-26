import { UMB_DICTIONARY_ROOT_ENTITY_TYPE } from '../entity.js';
import { UMB_DICTIONARY_MENU_ALIAS } from '../menu/manifests.js';
import type { ManifestSection, ManifestSectionSidebarApp } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DICTIONARY_SECTION_ALIAS = 'Umb.Section.Translation';

const section: ManifestSection = {
	type: 'section',
	alias: UMB_DICTIONARY_SECTION_ALIAS,
	name: 'Dictionary Section',
	weight: 100,
	meta: {
		label: 'Dictionary',
		pathname: 'dictionary',
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionUserPermission',
			match: UMB_DICTIONARY_SECTION_ALIAS,
		},
	],
};

const menuSectionSidebarApp: ManifestSectionSidebarApp = {
	type: 'sectionSidebarApp',
	kind: 'menuWithEntityActions',
	alias: 'Umb.SidebarMenu.Dictionary',
	name: 'Dictionary Sidebar Menu',
	weight: 100,
	meta: {
		label: 'Dictionary',
		menu: UMB_DICTIONARY_MENU_ALIAS,
		entityType: UMB_DICTIONARY_ROOT_ENTITY_TYPE,
	},
	conditions: [
		{
			alias: 'Umb.Condition.SectionAlias',
			match: UMB_DICTIONARY_SECTION_ALIAS,
		},
	],
};

export const manifests = [section, menuSectionSidebarApp];
