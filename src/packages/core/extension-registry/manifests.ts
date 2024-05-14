import { manifests as conditionManifests } from './conditions/manifests.js';
import { manifests as menuItemManifests } from './menu-item/manifests.js';
import { manifests as workspaceManifests } from './workspace/manifests.js';
import { manifests as collectionManifests } from './collection/manifests.js';
import type { ManifestTypes } from './models/index.js';

export const manifests: Array<ManifestTypes> = [
	...conditionManifests,
	...menuItemManifests,
	...workspaceManifests,
	...collectionManifests,
];
