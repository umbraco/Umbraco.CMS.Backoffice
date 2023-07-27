import { ManifestUserProfileApp } from '@umbraco-cms/backoffice/extension-registry';

export const userProfileApps: Array<ManifestUserProfileApp> = [
	{
		type: 'userProfileApp',
		alias: 'Umb.UserProfileApp.profile',
		name: 'Profile User Profile App',
		loader: () => import('./user-profile-app-profile.element.js'),
		weight: 900,
		meta: {
			label: 'Profile User Profile App',
			pathname: 'profile',
		},
	},
	{
		type: 'userProfileApp',
		alias: 'Umb.UserProfileApp.ExternalLoginProviders',
		name: 'External Login Providers User Profile App',
		loader: () => import('./user-profile-app-external-login-providers.element.js'),
		weight: 800,
		meta: {
			label: 'External Login Providers User Profile App',
			pathname: 'externalLoginProviders',
		},
	},
	{
		type: 'userProfileApp',
		alias: 'Umb.UserProfileApp.Themes',
		name: 'Themes User Profile App',
		loader: () => import('./user-profile-app-themes.element.js'),
		weight: 200,
		meta: {
			label: 'Themes User Profile App',
			pathname: 'themes',
		},
	},
	{
		type: 'userProfileApp',
		alias: 'Umb.UserProfileApp.History',
		name: 'History User Profile App',
		loader: () => import('./user-profile-app-history.element.js'),
		weight: 100,
		meta: {
			label: 'History User Profile App',
			pathname: 'history',
		},
	},
];
export const manifests = [...userProfileApps];
