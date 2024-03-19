import { manifests as entityActionsManifests } from './entity-actions/manifests.js';
import { manifests as menuItemManifests } from './menu-item/manifests.js';
import { manifests as repositoryManifests } from './repository/manifests.js';
import { manifests as treeManifests } from './tree/manifests.js';
import { manifests as workspaceManifests } from './workspace/manifests.js';
import { manifests as propertyEditorUiManifests } from './property-editors/manifests.js';

export const manifests = [
	...entityActionsManifests,
	...menuItemManifests,
	...repositoryManifests,
	...treeManifests,
	...workspaceManifests,
	...propertyEditorUiManifests,
];
