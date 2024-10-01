export const manifests: Array<UmbExtensionManifest> = [
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
	},
];
