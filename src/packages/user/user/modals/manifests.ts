import type { ManifestModal, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.User.Create',
		name: 'Create User Modal',
		js: () => import('./create/create-user-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.User.CreateSuccess',
		name: 'Create Success User Modal',
		js: () => import('./create/create-user-success-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.User.Picker',
		name: 'User Picker Modal',
		js: () => import('./user-picker/user-picker-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.User.Mfa',
		name: 'User Mfa Modal',
		js: () => import('./user-mfa/user-mfa-modal.element.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...modals];
