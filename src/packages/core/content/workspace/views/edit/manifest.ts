import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const contentEditorManifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.WorkspaceView.ContentEditor',
	matchKind: 'contentEditor',
	matchType: 'workspaceView',
	manifest: {
		type: 'workspaceView',
		kind: 'contentEditor',
		element: () => import('./content-editor.element.js'),
		weight: 1000,
		meta: {
			label: 'Content',
			pathname: 'edit',
			icon: 'icon-document-line',
		},
	},
};
