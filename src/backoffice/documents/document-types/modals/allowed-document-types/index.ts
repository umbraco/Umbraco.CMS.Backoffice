import { UmbModalToken } from '@umbraco-cms/modal';

export interface UmbAllowedDocumentTypesModalData {
	key: string | null;
}

export interface UmbAllowedDocumentTypesModalResult {
	documentTypeKey: string;
}

export const UMB_ALLOWED_DOCUMENT_TYPES_MODAL_TOKEN = new UmbModalToken<
	UmbAllowedDocumentTypesModalData,
	UmbAllowedDocumentTypesModalResult
>('Umb.Modal.AllowedDocumentTypes', {
	type: 'sidebar',
	size: 'small',
});
