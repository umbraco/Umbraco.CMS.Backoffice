import type { ManifestModal, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.LanguagePicker',
		name: 'Language Picker Modal',
		js: () => import('./language-picker/language-picker-modal.element.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...modals];
