import type { UmbMediaDetailModel } from '../../types.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemStoreBase } from '@umbraco-cms/backoffice/store';

/**
 * @export
 * @class UmbMediaUrlStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Media urls
 */

export class UmbMediaUrlStore extends UmbItemStoreBase<UmbMediaDetailModel> {
	/**
	 * Creates an instance of UmbMediaUrlStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMediaUrlStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_MEDIA_URL_STORE_CONTEXT.toString());
	}
}

export default UmbMediaUrlStore;

export const UMB_MEDIA_URL_STORE_CONTEXT = new UmbContextToken<UmbMediaUrlStore>('UmbMediaUrlStore');
