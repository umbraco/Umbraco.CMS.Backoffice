import { manifests as repositoryManifests } from './repository/manifests';
import { manifests as workspaceManifests } from './workspace/manifests';
import { manifests as modalManifests } from './modals/manifests';
import { manifests as sectionViewManifests } from './section-view/manifests';

export const manifests = [...repositoryManifests, ...workspaceManifests, ...modalManifests, ...sectionViewManifests];
