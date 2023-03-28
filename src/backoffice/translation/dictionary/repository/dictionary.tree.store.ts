import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbEntityTreeStore } from '@umbraco-cms/backoffice/store';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';

/**
 * @export
 * @class UmbDictionaryTreeStore
 * @extends {UmbEntityTreeStore}
 * @description - Tree Data Store for Dictionary
 */
export class UmbDictionaryTreeStore extends UmbEntityTreeStore {
	/**
	 * Creates an instance of UmbDictionaryTreeStore.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbDictionaryTreeStore
	 */
	constructor(host: UmbControllerHostInterface) {
		super(host, UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN.toString());
	}
}

export const UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDictionaryTreeStore>(
	'UmbDictionaryTreeStore'
);
