import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.TotalUsers',
		name: 'Total Users Dashboard App',
		weight: 500,
		element: () => import('./total-users-dashboard-app.element.js'),
	},
];
