import { manifests as workspaceManifests } from './workspace/manifests.js';
import { manifests as collectionManifests } from './collection/manifests.js';

export const manifests = [...workspaceManifests, ...collectionManifests];
