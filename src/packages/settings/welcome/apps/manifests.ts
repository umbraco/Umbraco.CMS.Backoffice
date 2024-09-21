import { manifests as communityIntroManifests } from './community-intro/manifests.js';
import { manifests as documentationIntroManifests } from './documentation-intro/manifests.js';
import { manifests as supportIntroManifests } from './support-intro/manifests.js';
import { manifests as trainingIntroManifests } from './training-intro/manifests.js';
import { manifests as videosIntroManifests } from './videos-intro/manifests.js';

import type { UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> = [
	...communityIntroManifests,
	...documentationIntroManifests,
	...supportIntroManifests,
	...trainingIntroManifests,
	...videosIntroManifests,
];
