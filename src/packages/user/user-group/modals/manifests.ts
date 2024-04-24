import type { ManifestModal, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.UserGroupPicker',
		name: 'User Group Picker Modal',
		js: () => import('./user-group-picker/user-group-picker-modal.element.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...modals];
