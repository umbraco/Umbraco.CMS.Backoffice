import { manifests as menuItemManifests } from './menu-item/manifests';
import { manifests as treeManifests } from './tree/manifests';
import { manifests as workspaceManifests } from './workspace/manifests';
import { manifests as repositoryManifests } from './repository/manifests';

export const manifests = [...menuItemManifests, ...treeManifests, ...repositoryManifests, ...workspaceManifests];
