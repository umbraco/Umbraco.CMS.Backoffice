import {
	ContentResult,
	Dictionary,
	DictionaryImport,
	DictionaryOverview,
	DictionaryResource,
} from '@umbraco-cms/backend-api';
import { UmbContextToken } from '@umbraco-cms/context-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { ArrayState, createObservablePart } from '@umbraco-cms/observable-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { UmbStoreBase } from '@umbraco-cms/store';
import { Observable } from 'rxjs';

export type UmbDictionaryDetailStoreItemType = DictionaryDetails | Dictionary | DictionaryOverview;
export const UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDictionaryDetailStore>(
	'UmbDictionaryDetailStore'
);

/**
 * @export
 * @class UmbDictionaryDetailStore
 * @extends {UmbStoreBase}
 * @description - Details Data Store for Data Types
 */
export class UmbDictionaryDetailStore extends UmbStoreBase {
	#data = new ArrayState<UmbDictionaryDetailStoreItemType>([], (x) => x.key);

	constructor(private host: UmbControllerHostInterface) {
		super(host, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN.toString());
	}

	/**
	 * @description - Request a Dictionary by key. The Dictionary is added to the store and is returned as an Observable.
	 * @param {string} key
	 * @return {*}  {(Observable<DictionaryDetails | null>)}
	 * @memberof UmbDictionaryStore
	 */
	getByKey(key: string): Observable<Dictionary> {
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryByKey({ key })).then(({ data }) => {
			if (data) {
				this.#data.appendOne(data);
			}
		});

		return createObservablePart(
			this.#data,
			(dictionary) => dictionary.find((entry) => entry.key === key) as Dictionary
		);
	}

	/**
	 * @description - Request the Dictionary. The Dictionary is added to the store and is returned as an Observable.
	 * @param {number} skip
	 * @param {number} take
	 * @return {*}  {(Observable<DictionaryDetails[]>)}
	 * @memberof UmbDictionaryStore
	 */
	get(skip: number, take: number): Observable<DictionaryOverview[]> {
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionary({ skip, take })).then(({ data }) => {
			if (data) {
				this.#data.append(data.items);
			}
		});

		return createObservablePart(this.#data, (dictionary) => dictionary as DictionaryOverview[]);
	}

	create(parentId: string, key: string, name: string): Observable<Dictionary> {
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
			this.#data.appendOne(data.value);
		});

		return createObservablePart(
			this.#data,
			(dictionary) => dictionary.find((entry) => entry.key === key) as Dictionary
		);
	}

	// TODO: make sure UI somehow can follow the status of this action.
	/**
	 * @description - Save changes to a Dictionary. The Dictionary is added to the store.
	 * @param {Array<UmbDictionaryStoreItemType>} items - base service implements save with an []T, Dictionary only saves a single item
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
	async save(items: Array<UmbDictionaryDetailStoreItemType>): Promise<void> {
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
				this.#data.append(items);
			}
		});
	}

	// TODO: How can we avoid having this in both stores?
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
		this.#data.remove(data);
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
	 * @param {File} file
	 * @return {*}  {(Observable<DictionaryImport | undefined>)}
	 * @memberof UmbDictionaryStore
	 */
	async upload(file: File): Promise<DictionaryImport | undefined> {
		const { data } = await tryExecuteAndNotify(
			this.host,
			DictionaryResource.postDictionaryUpload({
				requestBody: {
					file,
				},
			})
		);

		return data;
	}

	/// TODO => refresh tree and potentially dashboard after importing
	async import(file: string, parentId?: number): Promise<ContentResult | undefined> {
		const { data } = await tryExecuteAndNotify(this.host, DictionaryResource.postDictionaryImport({ file, parentId }));
		return data;
	}
}
