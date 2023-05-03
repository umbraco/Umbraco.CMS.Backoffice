import type { ManifestTypes } from '@umbraco-cms/backoffice/extensions-registry';

const headerApps: Array<ManifestTypes> = [
	{
		type: 'headerApp',
		alias: 'Umb.HeaderApp.Search',
		name: 'Header App Search',
		loader: () => import('./umb-search-header-app.element'),
		weight: 900,
		meta: {
			label: 'Search',
			icon: 'search',
			pathname: 'search',
		},
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.Search',
		name: 'Search Modal',
		loader: () => import('./search-modal/search-modal.element'),
	},
	{
		type: 'dashboard',
		alias: 'Umb.Dashboard.ExamineManagement',
		name: 'Examine Management Dashboard',
		elementName: 'umb-dashboard-examine-management',
		loader: () => import('./examine-management-dashboard/dashboard-examine-management.element'),
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
		type: 'headerApp',
		kind: 'button',
		alias: 'Umb.HeaderApp.HackDemo',
		name: 'Header App Search',
		weight: 10,
		meta: {
			label: 'Hack Demo',
			icon: 'document',
			href: '/section/content/workspace/document/edit/c05da24d-7740-447b-9cdc-bd8ce2172e38/en-us/view/content/tab/Local%20blog%20tab',
		},
	},
];

export const manifests = [...headerApps];
