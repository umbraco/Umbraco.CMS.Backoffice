import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'kind',
		alias: 'Umb.Kind.Dashboard.Default',
		matchKind: 'default',
		matchType: 'dashboard',
		manifest: {
			type: 'dashboard',
			element: () => import('./dashboard.element.js'),
		},
	},
];
