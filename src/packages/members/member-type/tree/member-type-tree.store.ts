import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbUniqueTreeStore } from '@umbraco-cms/backoffice/tree';

/**
 * @export
 * @class UmbMemberTypeTreeStore
 * @extends {UmbStoreBase}
 * @description - Tree Data Store for MemberType Items
 */
export class UmbMemberTypeTreeStore extends UmbUniqueTreeStore {
	/**
	 * Creates an instance of UmbMemberTypeTreeStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMemberTypeTreeStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_MEMBER_TYPE_TREE_STORE_CONTEXT.toString());
	}
}

export default UmbMemberTypeTreeStore;

export const UMB_MEMBER_TYPE_TREE_STORE_CONTEXT = new UmbContextToken<UmbMemberTypeTreeStore>('UmbMemberTypeTreeStore');
