import type { UmbStylesheetItemModel } from '../../types.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemStoreBase } from '@umbraco-cms/backoffice/store';

/**
 * @export
 * @class UmbStylesheetItemStore
 * @extends {UmbItemStoreBase}
 * @description - Data Store for Stylesheet items
 */

export class UmbStylesheetItemStore extends UmbItemStoreBase<UmbStylesheetItemModel> {
	/**
	 * Creates an instance of UmbStylesheetItemStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbStylesheetItemStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_STYLESHEET_ITEM_STORE_CONTEXT.toString());
	}
}

export default UmbStylesheetItemStore;

export const UMB_STYLESHEET_ITEM_STORE_CONTEXT = new UmbContextToken<UmbStylesheetItemStore>('UmbStylesheetItemStore');
