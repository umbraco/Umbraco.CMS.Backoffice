import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { DictionaryItemResponseModel } from '@umbraco-cms/backoffice/backend-api';

/**
 * @export
 * @class UmbDictionaryStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Dictionary
 */
export class UmbDictionaryStore extends UmbStoreBase {
	constructor(host: UmbControllerHostElement) {
		super(
			host,
			UMB_DICTIONARY_STORE_CONTEXT_TOKEN.toString(),
			new UmbArrayState<DictionaryItemResponseModel>([], (x) => x.id)
		);
	}

	append(dictionary: DictionaryItemResponseModel) {
		this._data.append([dictionary]);
	}

	remove(uniques: string[]) {
		this._data.remove(uniques);
	}
}

export const UMB_DICTIONARY_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDictionaryStore>('UmbDictionaryStore');
