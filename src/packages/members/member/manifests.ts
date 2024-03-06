import { manifests as entityActionManifests } from './entity-actions/manifests.js';
import { manifests as repositoryManifests } from './repository/manifests.js';
import { manifests as sectionViewManifests } from './section-view/manifests.js';
import { manifests as workspaceManifests } from './workspace/manifests.js';
import { manifests as collectionManifests } from './collection/manifests.js';
import { manifests as memberPickerModalManifests } from './components/member-picker-modal/manifests.js';

export const manifests = [
	...entityActionManifests,
	...repositoryManifests,
	...sectionViewManifests,
	...workspaceManifests,
	...collectionManifests,
	...memberPickerModalManifests,
];
