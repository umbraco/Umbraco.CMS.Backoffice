import { MemberGroupResource, ProblemDetailsModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbTreeDataSource } from '@umbraco-cms/backoffice/repository';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Member Group tree that fetches data from the server
 * @export
 * @class MemberGroupTreeServerDataSource
 * @implements {MemberGroupTreeDataSource}
 */
export class MemberGroupTreeServerDataSource implements UmbTreeDataSource {
	#host: UmbControllerHostElement;

	/**
	 * Creates an instance of MemberGroupTreeServerDataSource.
	 * @param {UmbControllerHostElement} host
	 * @memberof MemberGroupTreeServerDataSource
	 */
	constructor(host: UmbControllerHostElement) {
		this.#host = host;
	}

	/**
	 * Fetches the root items for the tree from the server
	 * @return {*}
	 * @memberof MemberGroupTreeServerDataSource
	 */
	async getRootItems() {
		return tryExecuteAndNotify(this.#host, MemberGroupResource.getTreeMemberGroupRoot({}));
	}

	/**
	 * Fetches the children of a given parent id from the server
	 * @param {(string | null)} parentId
	 * @return {*}
	 * @memberof MemberGroupTreeServerDataSource
	 */
	async getChildrenOf(parentId: string | null) {
		// Not implemented for this tree
		return {};
	}

	/**
	 * Fetches the items for the given ids from the server
	 * @param {Array<string>} ids
	 * @return {*}
	 * @memberof MemberGroupTreeServerDataSource
	 */
	async getItems(ids: Array<string>) {
		if (!ids || ids.length === 0) {
			const error: ProblemDetailsModel = { title: 'Keys are missing' };
			return { error };
		}

		return tryExecuteAndNotify(
			this.#host,
			MemberGroupResource.getMemberGroupItem({
				id: ids,
			})
		);
	}
}
