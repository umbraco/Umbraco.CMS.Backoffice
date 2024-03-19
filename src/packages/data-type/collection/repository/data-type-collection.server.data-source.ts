import type { UmbDataTypeCollectionFilterModel } from '../types.js';
import type { UmbDataTypeItemModel } from '../../repository/index.js';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { DataTypeResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbCollectionDataSource } from '@umbraco-cms/backoffice/collection';
import type { DataTypeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * A data source that fetches the data-type collection data from the server.
 * @export
 * @class UmbDataTypeCollectionServerDataSource
 * @implements {UmbCollectionDataSource}
 */
export class UmbDataTypeCollectionServerDataSource implements UmbCollectionDataSource<UmbDataTypeItemModel> {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbDataTypeCollectionServerDataSource.
	 * @param {UmbControllerHost} host
	 * @DataTypeof UmbDataTypeCollectionServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Gets the DataType collection filtered by the given filter.
	 * @param {UmbDataTypeCollectionFilterModel} filter
	 * @return {*}
	 * @DataTypeof UmbDataTypeCollectionServerDataSource
	 */
	async getCollection(filter: UmbDataTypeCollectionFilterModel) {
		const { data, error } = await tryExecuteAndNotify(this.#host, DataTypeResource.getFilterDataType(filter));

		if (error) {
			return { error };
		}

		if (!data) {
			return { data: { items: [], total: 0 } };
		}

		const { items, total } = data;

		const mappedItems: Array<UmbDataTypeItemModel> = items.map((item: DataTypeItemResponseModel) => {
			const dataTypeDetail: UmbDataTypeItemModel = {
				unique: item.id,
				name: item.name,
				propertyEditorUiAlias: item.editorUiAlias!,
			};

			return dataTypeDetail;
		});

		return { data: { items: mappedItems, total } };
	}
}
