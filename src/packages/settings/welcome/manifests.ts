import { UMB_SETTINGS_SECTION_ALIAS } from '../section/index.js';
import { manifests as dashboardAppManifests } from './apps/manifests.js';
import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboard',
		kind: 'default',
		alias: 'Umb.Dashboard.Settings.Overview',
		name: 'Settings Overview Dashboard',
		weight: 500,
		meta: {
			label: '#dashboardTabs_settingsWelcome',
			pathname: 'overview',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: UMB_SETTINGS_SECTION_ALIAS,
			},
		],
	},
	...dashboardAppManifests,
];
