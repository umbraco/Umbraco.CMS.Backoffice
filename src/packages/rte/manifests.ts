import { manifests as tiptapManifests } from './tiptap/manifests.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [...tiptapManifests];