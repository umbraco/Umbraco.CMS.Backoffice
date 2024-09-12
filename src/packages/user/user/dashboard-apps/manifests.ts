import { manifests as totalUsersManifests } from './total-users/manifests.js';
import { manifests as inactiveUsersManifests } from './inactive-users/manifests.js';

import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	...inactiveUsersManifests,
	...totalUsersManifests,
];
