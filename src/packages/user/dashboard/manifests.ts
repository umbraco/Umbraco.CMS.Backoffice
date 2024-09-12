import { UMB_USER_MANAGEMENT_SECTION_ALIAS } from '../section/index.js';
import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboard',
		kind: 'default',
		alias: 'Umb.Dashboard.UserManagement.Overview',
		name: 'User Management Overview Dashboard',
		weight: 1000,
		meta: {
			label: 'Overview',
			pathname: 'overview',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: UMB_USER_MANAGEMENT_SECTION_ALIAS,
			},
		],
	},
];
