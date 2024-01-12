import { UmbDataTypeDetailModel, UmbDataTypePropertyModel } from '../../types.js';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UmbDetailDataSource } from '@umbraco-cms/backoffice/repository';
import {
	CreateDataTypeRequestModel,
	DataTypeModelBaseModel,
	DataTypeResource,
} from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Data Type that fetches data from the server
 * @export
 * @class UmbDataTypeServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbDataTypeServerDataSource implements UmbDetailDataSource<UmbDataTypeDetailModel> {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbDataTypeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbDataTypeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Creates a new Data Type scaffold
	 * @param {(string | null)} parentUnique
	 * @return { CreateDataTypeRequestModel }
	 * @memberof UmbDataTypeServerDataSource
	 */
	async createScaffold(parentUnique: string | null) {
		const data: UmbDataTypeDetailModel = {
			entityType: 'data-type',
			unique: UmbId.new(),
			parentUnique,
			name: '',
			editorAlias: undefined,
			editorUiAlias: null,
			values: [],
		};

		return { data };
	}

	/**
	 * Fetches a Data Type with the given id from the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDataTypeServerDataSource
	 */
	async read(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const { data, error } = await tryExecuteAndNotify(this.#host, DataTypeResource.getDataTypeById({ id: unique }));

		if (error || !data) {
			return { error };
		}

		// TODO: make data mapper to prevent errors
		const dataType: UmbDataTypeDetailModel = {
			entityType: 'data-type',
			unique: data.id,
			parentUnique: data.parentId || null,
			name: data.name,
			editorAlias: data.editorAlias,
			editorUiAlias: data.editorUiAlias || null,
			values: data.values as Array<UmbDataTypePropertyModel>,
		};

		return { data: dataType };
	}

	/**
	 * Inserts a new Data Type on the server
	 * @param {UmbDataTypeDetailModel} dataType
	 * @return {*}
	 * @memberof UmbDataTypeServerDataSource
	 */
	async create(dataType: UmbDataTypeDetailModel) {
		if (!dataType) throw new Error('Data Type is missing');
		if (!dataType.unique) throw new Error('Data Type unique is missing');
		if (!dataType.editorAlias) throw new Error('Property Editor Alias is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: CreateDataTypeRequestModel = {
			id: dataType.unique,
			parentId: dataType.parentUnique,
			name: dataType.name,
			editorAlias: dataType.editorAlias,
			editorUiAlias: dataType.editorUiAlias,
			values: dataType.values,
		};

		const { error: createError } = await tryExecuteAndNotify(
			this.#host,
			DataTypeResource.postDataType({
				requestBody,
			}),
		);

		if (createError) {
			return { error: createError };
		}

		// We have to fetch the data type again. The server can have modified the data after creation
		return this.read(dataType.unique);
	}

	/**
	 * Updates a DataType on the server
	 * @param {UmbDataTypeDetailModel} DataType
	 * @return {*}
	 * @memberof UmbDataTypeServerDataSource
	 */
	async update(data: UmbDataTypeDetailModel) {
		if (!data.unique) throw new Error('Unique is missing');
		if (!data.editorAlias) throw new Error('Property Editor Alias is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: DataTypeModelBaseModel = {
			name: data.name,
			editorAlias: data.editorAlias,
			editorUiAlias: data.editorUiAlias,
			values: data.values,
		};

		const { error } = await tryExecuteAndNotify(
			this.#host,
			DataTypeResource.putDataTypeById({
				id: data.unique,
				requestBody,
			}),
		);

		if (error) {
			return { error };
		}

		// We have to fetch the data type again. The server can have modified the data after update
		return this.read(data.unique);
	}

	/**
	 * Deletes a Data Type on the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDataTypeServerDataSource
	 */
	async delete(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		return tryExecuteAndNotify(
			this.#host,
			DataTypeResource.deleteDataTypeById({
				id: unique,
			}),
		);
	}
}
