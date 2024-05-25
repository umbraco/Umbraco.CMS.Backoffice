import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';
import { manifests as detailManifests } from './detail/manifests.js';
import { manifests as itemManifests } from './item/manifests.js';

export const manifests: Array<ManifestTypes> = [...detailManifests, ...itemManifests];
