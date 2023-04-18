import { ArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UserResponseModel } from '@umbraco-cms/backoffice/backend-api';

export const UMB_USER_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbUserStore>('UmbUserStore');

/**
 * @export
 * @class UmbUserStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Users
 */
export class UmbUserStore extends UmbStoreBase {
	#data = new ArrayState<UserResponseModel>([], (x) => x.id);

	constructor(host: UmbControllerHostElement) {
		super(host, UMB_USER_STORE_CONTEXT_TOKEN.toString());
	}

	/**
	 * Append a user to the store
	 * @param {UserResponseModel} user
	 * @memberof UmbUserStore
	 */
	append(user: UserResponseModel) {
		this.#data.append([user]);
	}

	/**
	 * Get a user by id
	 * @param {id} UserResponseModel id.
	 * @memberof UmbUserStore
	 */
	byId(id: UserResponseModel['id']) {
		return this.#data.getObservablePart((x) => x.find((y) => y.id === id));
	}

	/**
	 * Removes data-types in the store with the given uniques
	 * @param {string[]} uniques
	 * @memberof UmbUserStore
	 */
	remove(uniques: Array<UserResponseModel['id']>) {
		this.#data.remove(uniques);
	}
}
