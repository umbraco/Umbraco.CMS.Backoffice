export const manifests = [
	{
		type: 'globalContext',
		alias: 'Umb.GlobalContext.ActiveUsers',
		name: 'Active Users Context',
		api: () => import('./active-users.context.js'),
	},
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
