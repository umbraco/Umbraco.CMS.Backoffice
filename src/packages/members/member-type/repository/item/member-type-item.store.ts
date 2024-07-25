import type { UmbMemberTypeItemModel } from './types.js';
import { UMB_MEMBER_TYPE_ITEM_STORE_CONTEXT } from './member-type-item.store.context-token.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemStoreBase } from '@umbraco-cms/backoffice/store';

/**
 * @export
 * @class UmbMemberTypeItemStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Member Type items
 */

export class UmbMemberTypeItemStore extends UmbItemStoreBase<UmbMemberTypeItemModel> {
	/**
	 * Creates an instance of UmbMemberTypeItemStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMemberTypeItemStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_MEMBER_TYPE_ITEM_STORE_CONTEXT.toString());
	}
}

export default UmbMemberTypeItemStore;
