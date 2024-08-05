import { manifests as defaultManifests } from './default/manifests.js';
import { manifests as itemManifests } from './item/manifests.js';
import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [...defaultManifests, ...itemManifests];
