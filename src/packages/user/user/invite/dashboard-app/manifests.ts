import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.User.InvitedUsers',
		name: 'Invited Users Dashboard App',
		weight: 300,
		element: () => import('./invited-users-dashboard-app.element.js'),
		meta: {
			headline: 'Pending Users',
			size: 'large',
		},
	},
];
