import type { UmbTreeDataSource } from '@umbraco-cms/backoffice/repository';
import { ProblemDetailsModel, DataTypeResource } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Document tree that fetches data from the server
 * @export
 * @class UmbDataTypeTreeServerDataSource
 * @implements {DocumentTreeDataSource}
 */
export class UmbDataTypeTreeServerDataSource implements UmbTreeDataSource {
	#host: UmbControllerHostInterface;

	/**
	 * Creates an instance of UmbDataTypeTreeServerDataSource.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbDataTypeTreeServerDataSource
	 */
	constructor(host: UmbControllerHostInterface) {
		this.#host = host;
	}

	/**
	 * Fetches the root items for the tree from the server
	 * @return {*}
	 * @memberof UmbDataTypeTreeServerDataSource
	 */
	async getRootItems() {
		return tryExecuteAndNotify(this.#host, DataTypeResource.getTreeDataTypeRoot({}));
	}

	/**
	 * Fetches the children of a given parent key from the server
	 * @param {(string | null)} parentKey
	 * @return {*}
	 * @memberof UmbDataTypeTreeServerDataSource
	 */
	async getChildrenOf(parentKey: string | null) {
		if (!parentKey) throw new Error('Parent key is missing');

		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.getTreeDataTypeChildren({
				parentKey,
			})
		);
	}

	/**
	 * Fetches the items for the given keys from the server
	 * @param {Array<string>} keys
	 * @return {*}
	 * @memberof UmbDataTypeTreeServerDataSource
	 */
	async getItems(keys: Array<string>) {
		if (!keys) throw new Error('Keys are missing');
		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.getTreeDataTypeItem({
				key: keys,
			})
		);
	}
}
