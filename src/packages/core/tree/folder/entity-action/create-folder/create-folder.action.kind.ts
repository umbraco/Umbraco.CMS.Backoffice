import { UmbCreateFolderEntityAction } from './create-folder.action.js';
import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST } from '@umbraco-cms/backoffice/entity-action';

export const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.EntityAction.Folder.Create',
	matchKind: 'folderCreate',
	matchType: 'entityAction',
	manifest: {
		...UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST.manifest,
		type: 'entityAction',
		kind: 'folderCreate',
		api: UmbCreateFolderEntityAction,
		weight: 900,
		forEntityTypes: [],
		meta: {
			icon: 'icon-add',
			label: 'Create folder...',
		},
	},
};
