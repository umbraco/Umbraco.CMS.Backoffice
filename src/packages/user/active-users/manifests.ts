export const manifests = [
	{
		type: 'headerApp',
		alias: 'Umb.HeaderApp.ActiveUsers',
		name: 'Active Users Header App',
		element: () => import('./active-users-header-app.element.js'),
		weight: 1000,
		meta: {
			label: 'TODO: how should we enable this to not be set.',
			icon: 'TODO: how should we enable this to not be set.',
		},
	},
];
