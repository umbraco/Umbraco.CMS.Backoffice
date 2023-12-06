import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbExportDictionaryModalData {
	unique: string | null;
}

export interface UmbExportDictionaryModalValue {
	includeChildren?: boolean;
}

export const UMB_EXPORT_DICTIONARY_MODAL = new UmbModalToken<
	UmbExportDictionaryModalData,
	UmbExportDictionaryModalValue
>('Umb.Modal.ExportDictionary', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
});
