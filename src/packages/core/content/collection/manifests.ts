import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbBackofficeManifestKind> = [
	{
		type: 'kind',
		alias: 'Umb.Kind.WorkspaceView.ContentCollection',
		matchKind: 'contentCollection',
		matchType: 'workspaceView',
		manifest: {
			type: 'workspaceView',
			kind: 'contentCollection',
			element: () => import('./content-collection-workspace-view.element.js'),
			weight: 300,
			meta: {
				label: 'Collection',
				pathname: 'collection',
				icon: 'icon-grid',
			},
		},
	},
];
