import type { DataTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { ArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

export const UMB_DATA_TYPE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDataTypeStore>('UmbDataTypeStore');

/**
 * @export
 * @class UmbDataTypeStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Template Details
 */
export class UmbDataTypeStore extends UmbStoreBase {
	#data = new ArrayState<DataTypeResponseModel>([], (x) => x.id);

	/**
	 * Creates an instance of UmbDataTypeStore.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbDataTypeStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_DATA_TYPE_STORE_CONTEXT_TOKEN.toString());
	}

	/**
	 * Append a data-type to the store
	 * @param {DataTypeModel} dataType
	 * @memberof UmbDataTypeStore
	 */
	append(dataType: DataTypeResponseModel) {
		this.#data.append([dataType]);
	}

	/**
	 * Append a data-type to the store
	 * @param {id} DataTypeModel id.
	 * @memberof UmbDataTypeStore
	 */
	byId(id: DataTypeResponseModel['id']) {
		return this.#data.getObservablePart((x) => x.find((y) => y.id === id));
	}

	/**
	 * Removes data-types in the store with the given uniques
	 * @param {string[]} uniques
	 * @memberof UmbDataTypeStore
	 */
	remove(uniques: Array<DataTypeResponseModel['id']>) {
		this.#data.remove(uniques);
	}
}
