import { DocumentTreeItem, EntityTreeItem } from '@umbraco-cms/backend-api';
import { UmbContextToken } from '@umbraco-cms/context-api';
import { ArrayState } from '@umbraco-cms/observable-api';
import { UmbStoreBase } from '@umbraco-cms/store';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

/**
 * @export
 * @class UmbDictionaryTreeStore
 * @extends {UmbStoreBase}
 * @description - Tree Data Store for Data Types
 */
export class UmbDictionaryTreeStore extends UmbStoreBase {
	#data = new ArrayState<DocumentTreeItem>([], (x) => x.key);

	
	/**
	 * Creates an instance of UmbDictionaryTreeStore.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbDictionaryTreeStore
	 */
	constructor(host: UmbControllerHostInterface) {
		super(host, UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN.toString());
	}

	/**
	 * Appends items to the store
	 * @param {Array<EntityTreeItem>} items
	 * @memberof UmbDictionaryTreeStore
	 */
	appendItems(items: Array<EntityTreeItem>) {
		this.#data.append(items);
	}

	/**
	 * Updates an item in the store
	 * @param {string} key
	 * @param {Partial<EntityTreeItem>} data
	 * @memberof UmbDictionaryTreeStore
	 */
	updateItem(key: string, data: Partial<EntityTreeItem>) {
		const entries = this.#data.getValue();
		const entry = entries.find((entry) => entry.key === key);

		if (entry) {
			this.#data.appendOne({ ...entry, ...data });
		}
	}

	/**
	 * Removes an item from the store
	 * @param {string} key
	 * @memberof UmbDictionaryTreeStore
	 */
	removeItem(key: string) {
		const entries = this.#data.getValue();
		const entry = entries.find((entry) => entry.key === key);

		if (entry) {
			this.#data.remove([key]);
		}
	}

	/**
	 * Returns an observable to observe the root items
	 * @return {*}
	 * @memberof UmbDictionaryTreeStore
	 */
	rootItems() {
		return this.#data.getObservablePart((items) => items.filter((item) => item.parentKey === null));
	}

	/**
	 * Returns an observable to observe the children of a given parent
	 * @param {(string | null)} parentKey
	 * @return {*}
	 * @memberof UmbDictionaryTreeStore
	 */
	childrenOf(parentKey: string | null) {
		return this.#data.getObservablePart((items) => items.filter((item) => item.parentKey === parentKey));
	}

	/**
	 * Returns an observable to observe the items with the given keys
	 * @param {Array<string>} keys
	 * @return {*}
	 * @memberof UmbDictionaryTreeStore
	 */
	items(keys: Array<string>) {
		return this.#data.getObservablePart((items) => items.filter((item) => keys.includes(item.key ?? '')));
	}
}

export const UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDictionaryTreeStore>(
	UmbDictionaryTreeStore.name
);