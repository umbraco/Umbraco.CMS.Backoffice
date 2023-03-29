import { UmbFolderDataSource } from '@umbraco-cms/backoffice/repository';
import { DataTypeResource, FolderReponseModel, CreateFolderRequestModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for a Data Type folder that fetches data from the server
 * @export
 * @class UmbDataTypeFolderServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbDataTypeFolderServerDataSource
	implements UmbFolderDataSource<CreateFolderRequestModel, FolderReponseModel>
{
	#host: UmbControllerHostInterface;

	/**
	 * Creates an instance of UmbDataTypeFolderServerDataSource.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbDataTypeFolderServerDataSource
	 */
	constructor(host: UmbControllerHostInterface) {
		this.#host = host;
	}

	/**
	 * Fetches a Data Type folder with the given key from the server
	 * @param {string} key
	 * @return {*}
	 * @memberof UmbDataTypeFolderServerDataSource
	 */
	async get(key: string) {
		if (!key) throw new Error('Key is missing');
		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.getDataTypeFolderByKey({
				key,
			})
		);
	}

	/**
	 * Inserts a new Data Type folder on the server
	 * @param {folder} folder
	 * @return {*}
	 * @memberof UmbDataTypeFolderServerDataSource
	 */
	async insert(folder: CreateFolderRequestModel) {
		if (!folder) throw new Error('folder is missing');
		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.postDataTypeFolder({
				requestBody: folder,
			})
		);
	}

	/**
	 * Deletes a Data Type folder with the given key on the server
	 * @param {string} key
	 * @return {*}
	 * @memberof UmbDataTypeServerDataSource
	 */
	async delete(key: string) {
		if (!key) throw new Error('Key is missing');
		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.deleteDataTypeFolderByKey({
				key,
			})
		);
	}
}
