import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../../../core/stores/store';
import { ContentResult, DictionaryImport, DictionaryItemsImport, DictionaryResource, EntityTreeItem } from '@umbraco-cms/backend-api';
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
			}
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
		tryExecuteAndNotify(
			this.host,
			DictionaryResource.getTreeDictionaryChildren({
				parentKey: key,
			})
		).then(({ data }) => {
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
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryByKey({ key })).then(({ data }) => {
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
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionary({ skip, take })).then(({ data }) => {
			if (data) {
				this.updateItems(data.items);
			}
		});

		return this.items.pipe(map((items) => items as DictionaryDetails[]));
	}

	async create(parentId: string, key: string, name: string): Promise<void> {
		tryExecuteAndNotify(
			this.host,
			DictionaryResource.postDictionary({
				requestBody: {
					parentId,
					key,
				},
			})
		).then(({ data }) => {
			if (!data) return;

			// TODO => how do we set the name, given only the key is saved?
			data.value.name = name;
			umbDictionaryData.save([data.value]);
			this.updateItems([data.value]);
		});
	}

	/**
	 * @description - Save changes to a Dictionary. The Dictionary is added to the store.
	 * @param {Array<UmbDictionaryStoreItemType>} items - base service implements save with an []T, Dictionary only saves a single item
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
	async save(items: Array<UmbDictionaryStoreItemType>): Promise<void> {
		if (!items[0].key) return;
		await tryExecuteAndNotify(
			this.host,
			DictionaryResource.patchDictionaryById({
				id: items[0].key,
				requestBody: [
					{
						value: JSON.stringify(items[0]),
					},
				],
			})
		).then(({ data }) => {
			if (data) {
				// TODO => save doesn't return items
				// so update with the updated entity
				this.updateItems(items);
			}
		});
	}

	/**
	 * @description - Delete a Dictionary. The Dictionary is removed from the store.
	 * @param {string} key
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
	async delete(key: string): Promise<void> {
		const { data } = await tryExecuteAndNotify(
			this.host,
			DictionaryResource.deleteDictionaryByKey({
				key,
			})
		);

		if (!data) return;

		this.deleteItems(data);
	}

	/**
	 * @description - Export a Dictionary, optionally including child items.
	 * @param {string} key
	 * @param {boolean} includeChildren
	 * @return {*}  {(Observable<void | null>)}
	 * @memberof UmbDictionaryStore
	 */
	async export(key: string, includeChildren: boolean): Promise<void> {
		await tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryExportByKey({ key, includeChildren }));
	}

	/**
	 * @description - Upload a Dictionary
	 * @param {FormData} formData
	 * @return {*}  {(Observable<DictionaryImport | undefined>)}
	 * @memberof UmbDictionaryStore
	 */
	async upload(formData: FormData): Promise<DictionaryImport | undefined> {
		const { data } = await tryExecuteAndNotify(
			this.host,
			DictionaryResource.postDictionaryUpload({
				requestBody: {
					file: formData,
				},
			})
		);

		return data;
	}

	/// TODO => refresh tree and potentially dashboard after importing
	async import(file: string, parentId?: number): Promise<ContentResult | undefined> {
		const { data } =  await tryExecuteAndNotify(this.host, DictionaryResource.postDictionaryImport({ file, parentId }));
		return data;
	}
}
