import { UMB_USER_MANAGEMENT_DASHBOARD_ALIAS } from '../../../dashboard/index.js';
import { UMB_DASHBOARD_ALIAS_CONDITION_ALIAS } from '@umbraco-cms/backoffice/dashboard';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.TotalUsers',
		name: 'Total Users Dashboard App',
		weight: 500,
		element: () => import('./total-users-dashboard-app.element.js'),
		meta: {
			headline: 'Total Users',
			size: 'small',
		},
		conditions: [
			{
				alias: UMB_DASHBOARD_ALIAS_CONDITION_ALIAS,
				match: UMB_USER_MANAGEMENT_DASHBOARD_ALIAS,
			},
		],
	},
];
