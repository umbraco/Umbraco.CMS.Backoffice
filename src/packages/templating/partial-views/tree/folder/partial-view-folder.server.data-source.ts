import { UmbServerFilePathUniqueSerializer } from '@umbraco-cms/backoffice/server-file-system';
import type { UmbCreateFolderModel, UmbFolderDataSource, UmbUpdateFolderModel } from '@umbraco-cms/backoffice/tree';
import type { CreatePartialViewFolderRequestModel } from '@umbraco-cms/backoffice/external/backend-api';
import { PartialViewService } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for Partial View folders that fetches data from the server
 * @export
 * @class UmbPartialViewFolderServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbPartialViewFolderServerDataSource implements UmbFolderDataSource {
	#host: UmbControllerHost;
	#serverFilePathUniqueSerializer = new UmbServerFilePathUniqueSerializer();

	/**
	 * Creates an instance of UmbPartialViewFolderServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbPartialViewFolderServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches a Partial View folder from the server
	 * @param {string} unique
	 * @return {UmbDataSourceResponse<UmbFolderModel>}
	 * @memberof UmbPartialViewFolderServerDataSource
	 */
	async read(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const path = this.#serverFilePathUniqueSerializer.toServerPath(unique);
		if (!path) throw new Error('Cannot read partial view folder without a path');

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			PartialViewService.getPartialViewFolderByPath({
				path: encodeURIComponent(path),
			}),
		);

		if (data) {
			const mappedData = {
				unique: this.#serverFilePathUniqueSerializer.toUnique(data.path),
				parentUnique: data.parent ? this.#serverFilePathUniqueSerializer.toUnique(data.parent.path) : null,
				name: data.name,
			};

			return { data: mappedData };
		}

		return { error };
	}

	/**
	 * Creates a Partial View folder on the server
	 * @param {UmbCreateFolderModel} args
	 * @return {UmbDataSourceResponse<UmbFolderModel>}
	 * @memberof UmbPartialViewFolderServerDataSource
	 */
	async create(args: UmbCreateFolderModel) {
		if (args.parentUnique === undefined) throw new Error('Parent unique is missing');
		if (!args.name) throw new Error('Name is missing');

		const parentPath = new UmbServerFilePathUniqueSerializer().toServerPath(args.parentUnique);

		const requestBody: CreatePartialViewFolderRequestModel = {
			parent: parentPath ? { path: parentPath } : null,
			name: args.name,
		};

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			PartialViewService.postPartialViewFolder({
				requestBody,
			}),
		);

		if (data) {
			const newPath = decodeURIComponent(data);
			const newPathUnique = this.#serverFilePathUniqueSerializer.toUnique(newPath);
			return this.read(newPathUnique);
		}

		return { error };
	}

	/**
	 * Deletes a Partial View folder on the server
	 * @param {string} unique
	 * @return {UmbDataSourceErrorResponse}
	 * @memberof UmbPartialViewServerDataSource
	 */
	async delete(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const path = this.#serverFilePathUniqueSerializer.toServerPath(unique);
		if (!path) throw new Error('Cannot delete partial view folder without a path');

		return tryExecuteAndNotify(
			this.#host,
			PartialViewService.deletePartialViewFolderByPath({
				path: encodeURIComponent(path),
			}),
		);
	}

	async update(args: UmbUpdateFolderModel): Promise<any> {
		throw new Error('Updating is not supported');
	}
}
