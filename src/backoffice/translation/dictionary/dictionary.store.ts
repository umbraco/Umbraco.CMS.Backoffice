import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../../../core/stores/store';
import { DictionaryResource, EntityTreeItem } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { umbDictionaryData } from 'src/core/mocks/data/dictionary.data';

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
	getTreeRoot(): Observable<Array<EntityTreeItem>> {
		tryExecuteAndNotify(this.host, DictionaryResource.getTreeDictionaryRoot({})).then(({ data }) => {
			if (data) {
				this.updateItems(data.items);
			};
		});

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === null)));
	}

	/**
	 * @description - Get the children of a tree item.
	 * @param {string} key
	 * @return {*}  {Observable<Array<UmbDictionaryStoreItemType>>}
	 * @memberof UmbDataTypesStore
	 */
	getTreeItemChildren(key: string): Observable<Array<EntityTreeItem>> {
		tryExecuteAndNotify(this.host, DictionaryResource.getTreeDictionaryChildren({
			parentKey: key,
		})).then(({ data }) => {
			if (data) {
			this.updateItems(data.items);
			}
		});

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === key)));
	}

	/**
	 * @description - Request a Dictionary by key. The Dictionary is added to the store and is returned as an Observable.
	 * @param {string} key
	 * @return {*}  {(Observable<DictionaryDetails | null>)}
	 * @memberof UmbDictionaryStore
	 */
	getByKey(key: string): Observable<DictionaryDetails | null> {
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryByKey({ key })).then(
			({ data }) => {
				if (data) {
					this.updateItems([data]);
				}
			});

		return this.items.pipe(
			map((dictionary) => (dictionary.find((entry) => entry.key === key) as DictionaryDetails) || null)
		);
	}

	/**
	 * @description - Request the Dictionary. The Dictionary is added to the store and is returned as an Observable.
	 * @param {number} skip
	 * @param {number} take
	 * @return {*}  {(Observable<DictionaryDetails[]>)}
	 * @memberof UmbDictionaryStore
	 */
	get(skip: number, take: number): Observable<DictionaryDetails[]> {
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionary({ skip, take })).then(
			({data}) => {
				if (data) {
				this.updateItems(data.items);
				}
			});

		return this.items.pipe(map((items) => items as DictionaryDetails[]));
	}

	async create(parentId: string, key: string, name: string): Promise<void> {
		await DictionaryResource.postDictionary({
			requestBody: {
				parentId,
				key,
			},
		}).then(
			(res) => {
				res.value.name = name;
				// TODO => how do we set the name, given only the key is saved?
				umbDictionaryData.save([res.value]);
				this.updateItems([res.value]);
			},
			(e) => {
				this.logError(e);
			}
		);
	}

	/**
	 * @description - Save changes to a Dictionary. The Dictionary is added to the store.
	 * @param {Array<UmbDictionaryStoreItemType>} items - base service implements save with an []T, Dictionary only saves a single item
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
	async save(items: Array<UmbDictionaryStoreItemType>): Promise<void> {
		if (!items[0].key) return;
debugger;
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

	/**
	 * @description - Delete a Dictionary. The Dictionary is removed from the store.
	 * @param {string} key
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
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

	/**
	 * @description - Export a Dictionary, optionally including child items.
	 * @param {string} key
	 * @param {boolean} includeChildren
	 * @return {*}  {(Observable<Blob | null>)}
	 * @memberof UmbDictionaryStore
	 */
	async export(key: string, includeChildren: boolean): Promise<Blob> {
		const blob = await DictionaryResource.getDictionaryExportByKey({ key, includeChildren });
		return blob;
	}
}
