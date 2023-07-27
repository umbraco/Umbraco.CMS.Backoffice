import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbImportDictionaryModalData {
	unique: string | null;
}

export interface UmbImportDictionaryModalResult {
	temporaryFileId?: string;
	parentId?: string;
}

export const UMB_IMPORT_DICTIONARY_MODAL = new UmbModalToken<
	UmbImportDictionaryModalData,
	UmbImportDictionaryModalResult
>('Umb.Modal.ImportDictionary', {
	type: 'sidebar',
	size: 'small',
});
