import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.TrainingIntro',
		name: 'Training Intro Dashboard App',
		weight: 400,
		element: () => import('./training-intro-dashboard-app.element.js'),
	},
];
