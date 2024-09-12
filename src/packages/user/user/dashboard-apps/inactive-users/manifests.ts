import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.InactiveUsers',
		name: 'Inactive Users Dashboard App',
		weight: 400,
		element: () => import('./inactive-users-dashboard-app.element.js'),
	},
];
