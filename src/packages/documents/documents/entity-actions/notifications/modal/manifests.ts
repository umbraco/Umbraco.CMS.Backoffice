import type { ManifestModal } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DOCUMENT_NOTIFICATIONS_MODAL_ALIAS = 'Umb.Modal.DocumentNotifications';

const modalManifest: ManifestModal = {
	type: 'modal',
	alias: UMB_DOCUMENT_NOTIFICATIONS_MODAL_ALIAS,
	name: 'Document Notifications Modal',
	js: () => import('./document-notifications-modal.element.js'),
};

export const manifests = [modalManifest];
