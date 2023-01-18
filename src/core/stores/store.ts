import type { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { UmbControllerHostInterface } from '../controller/controller-host.mixin';
import { UniqueBehaviorSubject } from '../observable-api/unique-behavior-subject';

export interface UmbStoreItem {
	unique: string;
	parentUnique: string | null;
}

export interface UmbDataStore<T> {
	readonly storeAlias: string;
	readonly items: Observable<Array<T>>;
	updateItems(items: Array<T>): void;
	deleteItems(keys: Array<string>): void;
}

export interface UmbTreeDataStore<T> extends UmbDataStore<T> {
	getTreeRoot(): Observable<Array<T>>;
	getTreeItemChildren(key: string): Observable<Array<T>>;
	getTreeItem(keys: string): Observable<Array<T>>;
}

export const createStoreItem = <T>(
	unique: string | null | undefined,
	parentUnique: string | null | undefined,
	data: T
): UmbStoreItem & T => {
	return Object.assign({ unique: unique || uuid(), parentUnique: parentUnique || null }, window.structuredClone(data));
};

/**
 * @export
 * @class UmbDataStoreBase
 * @implements {UmbDataStore<T>}
 * @template T
 * @description - Base class for Data Stores
 */
export abstract class UmbDataStoreBase<T extends UmbStoreItem> implements UmbDataStore<T> {
	public abstract readonly storeAlias: string;

	protected _items = new UniqueBehaviorSubject(<Array<T>>[]);
	public readonly items = this._items.asObservable();

	protected host: UmbControllerHostInterface;

	constructor(host: UmbControllerHostInterface) {
		this.host = host;
	}

	/**
	 * @description - Delete items from the store.
	 * @param {Array<string>} keys
	 * @memberof UmbDataStoreBase
	 */
	public deleteItems(keys: Array<string>): void {
		const remainingItems = this._items.getValue().filter((item) => item.unique && keys.includes(item.unique) === false);
		this._items.next(remainingItems);
	}

	/**
	 * @description - Update the store with new items. Existing items are updated, new items are added, old are kept.
	 * @param {Array<T>} items
	 * @memberof UmbDataStoreBase
	 */
	public updateItems(items: Array<T>): void {
		const newData = [...this._items.getValue()];
		items.forEach((newItem) => {
			const storedItemIndex = newData.findIndex((item) => item.unique === newItem.unique);
			if (storedItemIndex !== -1) {
				newData[storedItemIndex] = newItem;
			} else {
				newData.push(newItem);
			}
		});

		this._items.next(newData);
	}
}

/**
 * @export
 * @class UmbNodeStoreBase
 * @implements {UmbDataStore<T>}
 * @template T
 * @description - Base class for Data Stores
 */
export abstract class UmbNodeStoreBase<T extends UmbStoreItem> extends UmbDataStoreBase<T> {
	/**
	 * @description - Request data by a unique string. The data is added to the store and is returned as an Observable.
	 * @param {string} unique
	 * @return {*}  {(Observable<unknown>)}
	 * @memberof UmbDataStoreBase
	 */
	abstract getItem(unique: string): Observable<unknown>;

	/**
	 * @description - Save data.
	 * @param {object} data
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbNodeStoreBase
	 */
	abstract save(data: T[]): Promise<void>;
}
