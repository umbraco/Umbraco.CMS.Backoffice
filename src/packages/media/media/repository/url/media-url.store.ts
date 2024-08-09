import type { UmbMediaDetailModel } from '../../types.js';
import { UMB_MEDIA_URL_STORE_CONTEXT } from './media-url.store.context-token.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemStoreBase } from '@umbraco-cms/backoffice/store';

/**
 * @export
 * @class UmbMediaUrlStore
 * @augments {UmbStoreBase}
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
