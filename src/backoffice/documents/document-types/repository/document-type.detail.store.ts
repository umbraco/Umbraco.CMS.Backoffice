import { DocumentType } from '@umbraco-cms/backend-api';
import { UmbContextToken } from '@umbraco-cms/context-api';
import { ArrayState } from '@umbraco-cms/observable-api';
import { UmbStoreBase } from '@umbraco-cms/store';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

/**
 * @export
 * @class UmbDocumentTypeStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Document Types
 */
export class UmbDocumentTypeStore extends UmbStoreBase {
	#data = new ArrayState<DocumentType>([], (x) => x.key);

	/**
	 * Creates an instance of UmbDocumentTypeStore.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbDocumentTypeStore
	 */
	constructor(host: UmbControllerHostInterface) {
		super(host, UmbDocumentTypeStore.name);
	}

	/**
	 * Append a document-type to the store
	 * @param {DocumentType} document
	 * @memberof UmbDocumentTypeStore
	 */
	append(document: DocumentType) {
		this.#data.append([document]);
	}

	/**
	 * Removes document-types in the store with the given uniques
	 * @param {string[]} uniques
	 * @memberof UmbDocumentTypeStore
	 */
	remove(uniques: string[]) {
		this.#data.remove(uniques);
	}
}

export const UMB_DOCUMENT_TYPE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDocumentTypeStore>(
	UmbDocumentTypeStore.name
);
