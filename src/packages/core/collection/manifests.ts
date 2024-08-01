import { manifest as collectionAliasCondition } from './collection-alias.manifest.js';
import { manifest as collectionBulkActionPermissionCondition } from './collection-bulk-action-permission.manifest.js';
import { manifests as menuItemManifests } from './menu-item/manifests.js';
import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	collectionAliasCondition,
	collectionBulkActionPermissionCondition,
	...menuItemManifests,
];
