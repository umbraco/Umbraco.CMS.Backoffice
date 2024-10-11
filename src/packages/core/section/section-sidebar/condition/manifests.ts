import { UMB_IS_SECTION_SIDEBAR_CONDITION_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'condition',
		name: 'Is Section Sidebar Condition',
		alias: UMB_IS_SECTION_SIDEBAR_CONDITION_ALIAS,
		api: () => import('./is-section-sidebar.condition.js'),
	},
];
