import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbUniqueTreeStore } from '@umbraco-cms/backoffice/tree';

/**
 * @export
 * @class UmbScriptTreeStore
 * @extends {UmbUniqueTreeStore}
 * @description - Tree Data Store for Scripts
 */
export class UmbScriptTreeStore extends UmbUniqueTreeStore {
	/**
	 * Creates an instance of UmbScriptTreeStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbScriptTreeStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_SCRIPT_TREE_STORE_CONTEXT.toString());
	}
}

export default UmbScriptTreeStore;

export const UMB_SCRIPT_TREE_STORE_CONTEXT = new UmbContextToken<UmbScriptTreeStore>('UmbScriptTreeStore');
