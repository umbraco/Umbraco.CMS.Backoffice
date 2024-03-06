import { UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST } from '../../default/default.action.kind.js';
import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.EntityAction.Delete',
	matchKind: 'delete',
	matchType: 'entityAction',
	manifest: {
		...UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST.manifest,
		type: 'entityAction',
		kind: 'delete',
		api: () => import('./delete.action.js'),
		weight: 900,
		forEntityTypes: [],
		meta: {
			icon: 'icon-trash',
			label: 'Delete...',
			itemRepositoryAlias: '',
			detailRepositoryAlias: '',
		},
	},
};
