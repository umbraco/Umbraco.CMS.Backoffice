import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbTreeStoreBase } from '@umbraco-cms/backoffice/store';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

/**
 * @export
 * @class UmbMemberGroupTreeStore
 * @extends {UmbTreeStoreBase}
 * @description - Tree Data Store for Member Groups
 */
export class UmbMemberGroupTreeStore extends UmbTreeStoreBase {
	/**
	 * Creates an instance of UmbMemberGroupTreeStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbMemberGroupTreeStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_MEMBER_GROUP_TREE_STORE_CONTEXT_TOKEN.toString());
	}
}

export const UMB_MEMBER_GROUP_TREE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbMemberGroupTreeStore>(
	'UmbMemberGroupTreeStore'
);
