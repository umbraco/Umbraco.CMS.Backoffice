import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbBackofficeManifestKind> = [
	{
		type: 'kind',
		alias: 'Umb.Kind.WorkspaceView.Collection',
		matchKind: 'collection',
		matchType: 'workspaceView',
		manifest: {
			type: 'workspaceView',
			kind: 'collection',
			element: () => import('./workspace-view-collection.element.js'),
			weight: 300,
			meta: {
				label: 'Collection',
				pathname: 'collection',
				icon: 'icon-grid',
			},
		},
	},
];
