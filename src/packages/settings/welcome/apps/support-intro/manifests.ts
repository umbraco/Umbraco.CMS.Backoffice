import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.SupportIntro',
		name: 'Support Intro Dashboard App',
		weight: 400,
		element: () => import('./support-intro-dashboard-app.element.js'),
	},
];
