import type { ManifestModal } from '@umbraco-cms/backoffice/extensions-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.AllowedDocumentTypes',
		name: 'Allowed Document Types Modal',
		loader: () => import('./allowed-document-types/allowed-document-types-modal.element'),
	},
];

export const manifests = [...modals];
