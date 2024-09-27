import { UMB_USER_MANAGEMENT_DASHBOARD_ALIAS } from '../../../dashboard/index.js';
import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_DASHBOARD_ALIAS_CONDITION_ALIAS } from '@umbraco-cms/backoffice/dashboard';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.InactiveUsers',
		name: 'Inactive Users Dashboard App',
		weight: 400,
		element: () => import('./inactive-users-dashboard-app.element.js'),
		meta: {
			headline: 'Inactive Users',
			size: 'large',
		},
		conditions: [
			{
				alias: UMB_DASHBOARD_ALIAS_CONDITION_ALIAS,
				match: UMB_USER_MANAGEMENT_DASHBOARD_ALIAS,
			},
		],
	},
];
