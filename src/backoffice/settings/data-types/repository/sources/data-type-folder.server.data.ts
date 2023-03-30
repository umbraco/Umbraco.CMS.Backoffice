import { v4 as uuidv4 } from 'uuid';
import { UmbFolderDataSource } from '@umbraco-cms/backoffice/repository';
import { DataTypeResource, FolderReponseModel, CreateFolderRequestModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
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
	#host: UmbControllerHostElement;

	/**
	 * Creates an instance of UmbDataTypeFolderServerDataSource.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbDataTypeFolderServerDataSource
	 */
	constructor(host: UmbControllerHostElement) {
		this.#host = host;
	}

	async createScaffold(parentKey: string | null) {
		return {
			$type: 'FolderReponseModel', // TODO: check if we can remove this in the typescript generator
			name: '',
			key: uuidv4(),
			parentKey,
		};
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
