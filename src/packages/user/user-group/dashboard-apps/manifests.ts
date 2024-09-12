import { manifests as totalUserGroupsManifests } from './total-user-groups/manifests.js';

import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [...totalUserGroupsManifests];
