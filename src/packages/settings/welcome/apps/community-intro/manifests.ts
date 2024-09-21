import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.CommunityIntro',
		name: 'Community Intro Dashboard App',
		weight: 400,
		element: () => import('./community-intro-dashboard-app.element.js'),
	},
];
