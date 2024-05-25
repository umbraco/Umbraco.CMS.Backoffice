import { UmbDetailStoreBase } from '@umbraco-cms/backoffice/store';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbLanguageDetailModel } from '../../types.js';
import { UMB_LANGUAGE_DETAIL_STORE_CONTEXT } from './language-detail.store.context-token.js';

/**
 * @export
 * @class UmbLanguageDetailStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Language Details
 */
export class UmbLanguageDetailStore extends UmbDetailStoreBase<UmbLanguageDetailModel> {
	/**
	 * Creates an instance of UmbLanguageDetailStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbLanguageDetailStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_LANGUAGE_DETAIL_STORE_CONTEXT.toString());
	}
}

export default UmbLanguageDetailStore;
