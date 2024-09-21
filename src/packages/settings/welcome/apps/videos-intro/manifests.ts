import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.VideosIntro',
		name: 'Videos Intro Dashboard App',
		weight: 400,
		element: () => import('./videos-intro-dashboard-app.element.js'),
	},
];
