import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbEntityTreeStore } from '@umbraco-cms/backoffice/store';
import type { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';

/**
 * @export
 * @class UmbMemberGroupTreeStore
 * @extends {UmbEntityTreeStore}
 * @description - Tree Data Store for Member Groups
 */
export class UmbMemberGroupTreeStore extends UmbEntityTreeStore {
	/**
	 * Creates an instance of UmbMemberGroupTreeStore.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbMemberGroupTreeStore
	 */
	constructor(host: UmbControllerHostInterface) {
		super(host, UMB_MEMBER_GROUP_TREE_STORE_CONTEXT_TOKEN.toString());
	}
}

export const UMB_MEMBER_GROUP_TREE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbMemberGroupTreeStore>(
	'UmbMemberGroupTreeStore'
);
