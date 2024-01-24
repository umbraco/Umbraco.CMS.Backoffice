import { UmbServerFilePathUniqueSerializer } from '@umbraco-cms/backoffice/server-file-system';
import { UMB_STYLESHEET_ENTITY_TYPE, UMB_STYLESHEET_FOLDER_ENTITY_TYPE } from '../../entity.js';
import { UmbStylesheetItemModel } from '../../types.js';
import type { UmbItemDataSource } from '@umbraco-cms/backoffice/repository';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { StylesheetResource } from '@umbraco-cms/backoffice/backend-api';

/**
 * A data source for stylesheet items that fetches data from the server
 * @export
 * @class UmbStylesheetItemServerDataSource
 * @implements {UmbItemDataSource}
 */
export class UmbStylesheetItemServerDataSource implements UmbItemDataSource<UmbStylesheetItemModel> {
	#host: UmbControllerHost;
	#serverFilePathUniqueSerializer = new UmbServerFilePathUniqueSerializer();

	/**
	 * Creates an instance of UmbStylesheetItemServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbStylesheetItemServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches the items for the given uniques from the server
	 * @param {Array<string>} uniques
	 * @return {*}
	 * @memberof UmbStylesheetItemServerDataSource
	 */
	async getItems(uniques: Array<string>) {
		if (!uniques) throw new Error('Uniques are missing');

		const paths = uniques
			.map((unique) => {
				const serverPath = this.#serverFilePathUniqueSerializer.toServerPath(unique);
				return serverPath ? encodeURI(serverPath) : null;
			})
			.filter((x) => x !== null) as string[];

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			StylesheetResource.getStylesheetItem({
				path: paths,
			}),
		);

		if (data) {
			const items: Array<UmbStylesheetItemModel> = data.map((item) => {
				return {
					entityType: item.isFolder ? UMB_STYLESHEET_FOLDER_ENTITY_TYPE : UMB_STYLESHEET_ENTITY_TYPE,
					unique: this.#serverFilePathUniqueSerializer.toUnique(item.path),
					parentUnique: item.parent ? this.#serverFilePathUniqueSerializer.toUnique(item.parent.path) : null,
					name: item.name,
					isFolder: item.isFolder,
				};
			});

			return { data: items };
		}

		return { error };
	}
}
