import type { UmbMemberTypeDetailModel } from '../../types.js';
import { UMB_MEMBER_TYPE_DETAIL_STORE_CONTEXT } from './member-type-detail.store.context-token.js';
import { UmbDetailStoreBase } from '@umbraco-cms/backoffice/store';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * @export
 * @class UmbMemberTypeDetailStore
 * @augments {UmbStoreBase}
 * @description - Data Store for Member Type Details
 */
export class UmbMemberTypeDetailStore extends UmbDetailStoreBase<UmbMemberTypeDetailModel> {
	/**
	 * Creates an instance of UmbMemberTypeDetailStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMemberTypeDetailStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_MEMBER_TYPE_DETAIL_STORE_CONTEXT.toString());
	}
}

export default UmbMemberTypeDetailStore;
