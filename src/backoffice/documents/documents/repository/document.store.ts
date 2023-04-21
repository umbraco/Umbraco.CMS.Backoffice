import { DocumentResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

/**
 * @export
 * @class UmbDocumentDetailStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Template Details
 */
export class UmbDocumentStore extends UmbStoreBase {
	/**
	 * Creates an instance of UmbDocumentDetailStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbDocumentDetailStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_DOCUMENT_STORE_CONTEXT_TOKEN.toString(), new UmbArrayState<DocumentResponseModel>([], (x) => x.id));
	}

	/**
	 * Append a document to the store
	 * @param {DocumentDetails} document
	 * @memberof UmbDocumentDetailStore
	 */
	append(document: DocumentResponseModel) {
		this._data.append([document]);
	}

	/**
	 * Append a document to the store
	 * @param {DocumentModel} document
	 * @memberof UmbDocumentStore
	 */
	byKey(id: DocumentResponseModel['id']) {
		return this._data.getObservablePart((x) => x.find((y) => y.id === id));
	}

	/**
	 * Removes documents in the store with the given uniques
	 * @param {string[]} uniques
	 * @memberof UmbDocumentDetailStore
	 */
	remove(uniques: Array<DocumentResponseModel['id']>) {
		this._data.remove(uniques);
	}
}

export const UMB_DOCUMENT_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDocumentStore>('UmbDocumentStore');
