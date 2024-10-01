import { UMB_USER_MANAGEMENT_DASHBOARD_ALIAS } from '../../../dashboard/index.js';
import { UMB_DASHBOARD_ALIAS_CONDITION_ALIAS } from '@umbraco-cms/backoffice/dashboard';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.InactiveUsers',
		name: 'Inactive Users Dashboard App',
		weight: 400,
		element: () => import('./inactive-users-dashboard-app.element.js'),
		meta: {
			headline: 'Inactive Users',
			size: 'medium',
		},
		conditions: [
			{
				alias: UMB_DASHBOARD_ALIAS_CONDITION_ALIAS,
				match: UMB_USER_MANAGEMENT_DASHBOARD_ALIAS,
			},
		],
	},
];
