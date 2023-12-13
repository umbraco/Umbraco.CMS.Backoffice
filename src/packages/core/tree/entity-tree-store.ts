import { type UmbTreeStore } from './tree-store.interface.js';
import { UmbEntityTreeItemModel } from './types.js';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

/**
 * @export
 * @class UmbEntityTreeStore
 * @extends {UmbStoreBase}
 * @description - Entity Tree Store
 */
export class UmbEntityTreeStore
	extends UmbStoreBase<UmbEntityTreeItemModel>
	implements UmbTreeStore<UmbEntityTreeItemModel>
{
	constructor(host: UmbControllerHostElement, storeAlias: string) {
		super(host, storeAlias, new UmbArrayState<UmbEntityTreeItemModel>([], (x) => x.id));
	}

	/**
	 * An observable to observe the root items
	 * @memberof UmbEntityTreeStore
	 */
	rootItems = this._data.asObservablePart((items) => items.filter((item) => item.parentId === null));

	/**
	 * Returns an observable to observe the children of a given parent
	 * @param {(string | null)} parentId
	 * @return {*}
	 * @memberof UmbEntityTreeStore
	 */
	childrenOf(parentId: string | null) {
		return this._data.asObservablePart((items) => items.filter((item) => item.parentId === parentId));
	}

	/**
	 * Returns an observable to observe the items with the given ids
	 * @param {Array<string>} ids
	 * @return {*}
	 * @memberof UmbEntityTreeStore
	 */
	items(ids: Array<string | null>) {
		return this._data.asObservablePart((items) => items.filter((item) => ids.includes(item.id ?? '')));
	}
}
