import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'condition',
		name: 'Dashboard Alias Condition',
		alias: 'Umb.Condition.DashboardAlias',
		api: () => import('./dashboard-alias.condition.js'),
	},
];
