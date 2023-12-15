import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UmbEntityTreeStore } from '@umbraco-cms/backoffice/tree';

/**
 * @export
 * @class UmbStaticFileTreeStore
 * @extends {UmbStoreBase}
 * @description - Tree Data Store for Static File Items
 */
export class UmbStaticFileTreeStore extends UmbEntityTreeStore {
	/**
	 * Creates an instance of UmbStaticFileTreeStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbStaticFileTreeStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_STATIC_FILE_TREE_STORE_CONTEXT.toString());
	}
}

export const UMB_STATIC_FILE_TREE_STORE_CONTEXT = new UmbContextToken<UmbStaticFileTreeStore>('UmbStaticFileTreeStore');
