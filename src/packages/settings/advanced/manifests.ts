import { UMB_SETTINGS_SECTION_ALIAS } from '../section/index.js';
import { UMB_ADVANCED_SETTINGS_MENU_ALIAS } from './constants.js';

export const manifests = [
	{
		type: 'menu',
		alias: UMB_ADVANCED_SETTINGS_MENU_ALIAS,
		name: 'Advanced Settings Menu',
	},
	{
		type: 'sectionSidebarApp',
		kind: 'menu',
		alias: 'Umb.SectionSidebarApp.Menu.Users',
		name: 'Users Section Sidebar Menu',
		weight: 100,
		meta: {
			label: 'Users',
			menu: UMB_ADVANCED_SETTINGS_MENU_ALIAS,
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: UMB_SETTINGS_SECTION_ALIAS,
			},
		],
	},
];
