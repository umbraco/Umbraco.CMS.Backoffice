import { UMB_USER_MANAGEMENT_SECTION_ALIAS } from '../section/index.js';
import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.UserManagement.Overview',
		name: 'User Management Overview Dashboard',
		element: () => import('./user-management-overview-dashboard.element.js'),
		weight: 500,
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
