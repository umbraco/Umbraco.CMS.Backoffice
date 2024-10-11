import { manifests as repositoryManifests } from './repository/manifests.js';
import { manifests as sectionSidebarManifests } from './section-sidebar/manifests.js';
import { manifests as sectionUserPermissionConditionManifests } from './conditions/manifests.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.SectionPicker',
		name: 'Section Picker Modal',
		element: () => import('./section-picker-modal/section-picker-modal.element.js'),
	},
	...repositoryManifests,
	...sectionSidebarManifests,
	...sectionUserPermissionConditionManifests,
];
