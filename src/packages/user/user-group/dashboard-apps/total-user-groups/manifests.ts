import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.TotalUserGroups',
		name: 'Total User Groups Dashboard App',
		weight: 490,
		element: () => import('./total-user-groups-dashboard-app.element.js'),
		meta: {
			headline: 'Total User Groups',
			size: 'medium',
		},
	},
];
