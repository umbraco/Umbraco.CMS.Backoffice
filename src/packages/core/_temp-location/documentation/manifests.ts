import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.DocumentationIntro',
		name: 'Documentation Intro Dashboard App',
		weight: 400,
		element: () => import('./documentation-intro-dashboard-app.element.js'),
		meta: {
			headline: '#settingsDashboard_documentationHeader',
			size: 'small',
		},
		conditions: [
			{
				alias: 'Umb.Condition.DashboardAlias',
				oneOf: ['Umb.Dashboard.Content.Overview', 'Umb.Dashboard.Settings.Overview'], // These are magic string on purpose so we don't have an import to the packages from core.
			},
		],
	},
	{
		type: 'dashboardApp',
		alias: 'Umb.DashboardApp.VideosIntro',
		name: 'Videos Intro Dashboard App',
		weight: 400,
		element: () => import('./videos-intro-dashboard-app.element.js'),
		meta: {
			headline: '#settingsDashboard_videosHeader',
			size: 'small',
		},
		conditions: [
			{
				alias: 'Umb.Condition.DashboardAlias',
				oneOf: ['Umb.Dashboard.Content.Overview', 'Umb.Dashboard.Settings.Overview'], // These are magic string on purpose so we don't have an import to the packages from core.
			},
		],
	},
];
