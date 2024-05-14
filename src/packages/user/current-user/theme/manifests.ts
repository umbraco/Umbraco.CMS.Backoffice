import type { ManifestTypes, ManifestUserProfileApp } from '@umbraco-cms/backoffice/extension-registry';

export const userProfileApps: Array<ManifestUserProfileApp> = [
	{
		type: 'userProfileApp',
		alias: 'Umb.UserProfileApp.CurrentUser.Theme',
		name: 'Current User Theme User Profile App',
		element: () => import('./current-user-theme-user-profile-app.element.js'),
		weight: 200,
		meta: {
			label: 'Current User Theme User Profile App',
			pathname: 'themes',
		},
	},
];
export const manifests: Array<ManifestTypes> = [...userProfileApps];
