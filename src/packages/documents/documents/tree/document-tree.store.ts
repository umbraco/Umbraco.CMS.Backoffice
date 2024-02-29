import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbUniqueTreeStore } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

/**
 * @export
 * @class UmbDocumentTreeStore
 * @extends {UmbUniqueTreeStore}
 * @description - Tree Data Store for Document Items
 */
export class UmbDocumentTreeStore extends UmbUniqueTreeStore {
	/**
	 * Creates an instance of UmbDocumentTreeStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbDocumentTreeStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_DOCUMENT_TREE_STORE_CONTEXT.toString());
	}
}

export default UmbDocumentTreeStore;

export const UMB_DOCUMENT_TREE_STORE_CONTEXT = new UmbContextToken<UmbDocumentTreeStore>('UmbDocumentTreeStore');
