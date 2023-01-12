import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../../../core/stores/store';
import { DictionaryResource, EntityTreeItem } from '@umbraco-cms/backend-api';
import type { DictionaryDetails } from '@umbraco-cms/models';

export type UmbDictionaryStoreItemType = DictionaryDetails | EntityTreeItem;

/**
 * @export
 * @class UmbDictionaryStore
 * @extends {UmbDataStoreBase<UmbDictionaryStoreItemType | EntityTreeItem>}
 * @description - Data Store for Dictionary Items.
 */
export class UmbDictionaryStore extends UmbDataStoreBase<UmbDictionaryStoreItemType> {
	public readonly storeAlias = 'umbDictionaryStore';

	/**
	 * @description - Get the root of the tree.
	 * @return {*}  {Observable<Array<PagedEntityTreeItem>>}
	 * @memberof UmbDictionaryStore
	 */
	getTreeRoot(): Observable<Array<UmbDictionaryStoreItemType>> {
		DictionaryResource.getTreeDictionaryRoot({}).then(
			(res) => {
				this.updateItems(res.items);
			},
			(e) => {
				this.logError(e);
			}
		);

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === null)));
	}

	/**
	 * @description - Get the children of a tree item.
	 * @param {string} key
	 * @return {*}  {Observable<Array<UmbDictionaryStoreItemType>>}
	 * @memberof UmbDataTypesStore
	 */
	getTreeItemChildren(key: string): Observable<Array<UmbDictionaryStoreItemType>> {
		DictionaryResource.getTreeDictionaryChildren({
			parentKey: key,
		}).then(
			(res) => {
				this.updateItems(res.items);
			},
			(e) => {
				this.logError(e);
			}
		);

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === key)));
	}

	/**
	 * @description - Request a Dictionary by key. The Dictionary is added to the store and is returned as an Observable.
	 * @param {string} key
	 * @return {*}  {(Observable<DictionaryDetails | null>)}
	 * @memberof UmbDictionaryStore
	 */
	getByKey(key: string): Observable<DictionaryDetails | null> {
		DictionaryResource.getDictionaryByKey({ key })
			.then(
				(res) => {
					this.updateItems([res]);
				},
				(e) => {
					this.logError(e);
				}
			);
			
		return this.items.pipe(
			map((dictionary) => (dictionary.find((entry) => entry.key === key) as DictionaryDetails) || null)
		);
	}

	async save(items: Array<UmbDictionaryStoreItemType>): Promise<void> {
		// items is an array, but we only interested in the first item
		// in fact, it's always a single-item array
		if (!items[0].key) return;

		DictionaryResource.patchDictionaryById({
			id: items[0].key,
			requestBody: [
				{
					value: JSON.stringify(items[0]),
				},
			],
		}).then(
			(_) => {
				this.updateItems(items);
			},
			(e) => {
				this.logError(e);
			}
		);
	}

	async delete(key: string): Promise<void> {
		DictionaryResource.deleteDictionaryByKey({
			key,
		}).then(
			(res) => this.deleteItems(res),
			(e) => {
				this.logError(e);
			}
		);
	}
}
