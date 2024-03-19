import { UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST } from '../../default/default.action.kind.js';
import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.EntityAction.Trash',
	matchKind: 'trash',
	matchType: 'entityAction',
	manifest: {
		...UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST.manifest,
		type: 'entityAction',
		kind: 'trash',
		api: () => import('./trash.action.js'),
		weight: 900,
		forEntityTypes: [],
		meta: {
			icon: 'icon-trash',
			label: 'Trash',
			itemRepositoryAlias: '',
			trashRepositoryAlias: '',
		},
	},
};
