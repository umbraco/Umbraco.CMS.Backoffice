import type { ManifestDashboard } from '@umbraco-cms/backoffice/extensions-registry';

const dashboards: Array<ManifestDashboard> = [
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.RedirectManagement',
		name: 'Redirect Management Dashboard',
		loader: () => import('./redirect-management/dashboard-redirect-management.element'),
		weight: 10,
		meta: {
			label: 'Redirect Management',
			pathname: 'redirect-management',
		},
		conditions: {
			sections: ['Umb.Section.Content'],
		},
	},
];

export const manifests = [...dashboards];
