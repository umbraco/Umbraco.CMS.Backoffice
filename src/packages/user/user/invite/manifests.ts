import { manifests as collectionActionManifests } from './collection-action/manifests.js';
import { manifests as dashboardAppManifests } from './dashboard-app/manifests.js';
import { manifests as entityActionManifests } from './entity-action/manifests.js';
import { manifests as modalManifests } from './modal/manifests.js';
import { manifests as repositoryManifests } from './repository/manifests.js';

export const manifests: Array<UmbExtensionManifest> = [
	...collectionActionManifests,
	...dashboardAppManifests,
	...entityActionManifests,
	...modalManifests,
	...repositoryManifests,
];
