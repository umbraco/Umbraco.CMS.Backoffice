import { UMB_STYLESHEET_TREE_STORE_CONTEXT } from './stylesheet-tree.store.context-token.js';
import { UmbUniqueTreeStore } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * @export
 * @class UmbStylesheetTreeStore
 * @extends {UmbUniqueTreeStore}
 * @description - Tree Data Store for Stylesheets
 */
export class UmbStylesheetTreeStore extends UmbUniqueTreeStore {
	/**
	 * Creates an instance of UmbStylesheetTreeStore.
	 * @param {UmbControllerHost} host
	 * @memberof UmbStylesheetTreeStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_STYLESHEET_TREE_STORE_CONTEXT.toString());
	}
}

export default UmbStylesheetTreeStore;
