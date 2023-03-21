import type { ManifestDashboard, ManifestModal } from '@umbraco-cms/backoffice/extensions-registry';

const dashboards: Array<ManifestDashboard> = [
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.SettingsWelcome',
		name: 'Welcome Settings Dashboard',
		elementName: 'umb-dashboard-settings-welcome',
		loader: () => import('./settings-welcome/dashboard-settings-welcome.element'),
		weight: 500,
		meta: {
			label: 'Welcome',
			pathname: 'welcome',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.ExamineManagement',
		name: 'Examine Management Dashboard',
		elementName: 'umb-dashboard-examine-management',
		loader: () => import('./examine-management/dashboard-examine-management.element'),
		weight: 400,
		meta: {
			label: 'Examine Management',
			pathname: 'examine-management',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.ModelsBuilder',
		name: 'Models Builder Dashboard',
		elementName: 'umb-dashboard-models-builder',
		loader: () => import('./models-builder/dashboard-models-builder.element'),
		weight: 300,
		meta: {
			label: 'Models Builder',
			pathname: 'models-builder',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.PublishedStatus',
		name: 'Published Status Dashboard',
		elementName: 'umb-dashboard-published-status',
		loader: () => import('./published-status/dashboard-published-status.element'),
		weight: 200,
		meta: {
			label: 'Published Status',
			pathname: 'published-status',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.HealthCheck',
		name: 'Health Check',
		elementName: 'umb-dashboard-health-check',
		loader: () => import('./health-check/dashboard-health-check.element'),
		weight: 102,
		meta: {
			label: 'Health Check',
			pathname: 'health-check',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.Profiling',
		name: 'Profiling',
		elementName: 'umb-dashboard-performance-profiling',
		loader: () => import('./performance-profiling/dashboard-performance-profiling.element'),
		weight: 101,
		meta: {
			label: 'Profiling',
			pathname: 'profiling',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.Telemetry',
		name: 'Telemetry',
		elementName: 'umb-dashboard-telemetry',
		loader: () => import('./telemetry/dashboard-telemetry.element'),
		weight: 100,
		meta: {
			label: 'Telemetry Data',
			pathname: 'telemetry',
		},
		conditions: {
			sections: ['Umb.Section.Settings'],
		},
	},
];

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.ExamineFieldsSettings',
		name: 'Examine Field Settings Modal',
		loader: () => import('./examine-management/views/modal-views/fields-settings.element'),
	},
];

export const manifests = [...dashboards, ...modals];
