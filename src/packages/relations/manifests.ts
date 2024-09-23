import { manifests as menuManifests } from './menu/manifests.js';
import { manifests as relationManifests } from './relations/manifests.js';
import { manifests as relationTypeManifests } from './relation-types/manifests.js';

export const manifests: Array<UmbExtensionManifest> = [
	...relationTypeManifests,
	...relationManifests,
	...menuManifests,
];
