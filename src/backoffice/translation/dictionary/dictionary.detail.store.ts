import { Observable } from 'rxjs';
import {
	ContentResult,
	DictionaryImport,
	DictionaryItem,
	DictionaryOverview,
	DictionaryResource,
	LanguageResource,
} from '@umbraco-cms/backend-api';
import { UmbContextToken } from '@umbraco-cms/context-api';
import { UmbEntityDetailStore, UmbStoreBase } from '@umbraco-cms/store';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { ArrayState, createObservablePart } from '@umbraco-cms/observable-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';

export type UmbDictionaryDetailStoreItemType = DictionaryItem | DictionaryOverview;
export const UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDictionaryDetailStore>(
	'UmbDictionaryDetailStore'
);

/**
 * @export
 * @class UmbDictionaryDetailStore
 * @extends {UmbStoreBase}
 * @description - Details Data Store for Data Types
 */
// TODO: use the right type for dictionary:
export class UmbDictionaryDetailStore
	extends UmbStoreBase
	implements UmbEntityDetailStore<UmbDictionaryDetailStoreItemType>
{
	#data = new ArrayState<UmbDictionaryDetailStoreItemType>([], (x) => x.key);

	constructor(private host: UmbControllerHostInterface) {
		super(host, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN.toString());
	}

	getScaffold(entityType: string, parentKey: string | null) {
		return {} as UmbDictionaryDetailStoreItemType;
	}

	/**
	 * @description - Request a Dictionary by key. The Dictionary is added to the store and is returned as an Observable.
	 * @param {string} key
	 * @return {*}  {(Observable<DictionaryItem>)}
	 * @memberof UmbDictionaryStore
	 */
	getByKey(key: string): Observable<DictionaryItem> {
		tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryByKey({ key })).then(({ data }) => {
			if (data) {
				this.#data.appendOne(data);
			}
		});

		return createObservablePart(
			this.#data,
			(dictionary) => dictionary.find((entry) => entry.key === key) as DictionaryItem
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

	create(parentKey?: string, name?: string): Observable<DictionaryItem> {
		tryExecuteAndNotify(
			this.host,
			DictionaryResource.postDictionary({
				requestBody: {
					parentKey,
					name,
				},
			})
		).then(({ data }) => {
			if (!data) return;

			this.#data.appendOne(data.value);
		});

		return this.#data.getObservablePart(
			(documents) => documents.find((document) => document.name === name) as DictionaryItem
		);
	}

	// TODO: make sure UI somehow can follow the status of this action.
	/**
	 * @description - Save changes to a Dictionary. The Dictionary is added to the store.
	 * @param {Array<UmbDictionaryStoreItemType>} items - base service implements save with an []T, Dictionary only saves a single item
	 * @return {*}  {(Promise<void>)}
	 * @memberof UmbDictionaryStore
	 */
	async save(items: Array<DictionaryItem>): Promise<void> {
		if (!items[0].key) return;
		await tryExecuteAndNotify(
			this.host,
			DictionaryResource.putDictionaryByKey({
				key: items[0].key,
				requestBody: {
					name: items[0].name,
					translations: items[0].translations,
				},
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
	 * @return {*}  {(Observable<Blob | undefined>)}
	 * @memberof UmbDictionaryStore
	 */
	async export(key: string, includeChildren: boolean): Promise<Blob | undefined> {
		const { data } = await tryExecuteAndNotify(this.host, DictionaryResource.getDictionaryExportByKey({ key, includeChildren }));
		return data;
	}

	/**
	 * @description - Upload a Dictionary
	 * @param {File} file
	 * @return {*}  {(Observable<DictionaryImport | undefined>)}
	 * @memberof UmbDictionaryStore
	 */
	async upload(formData: FormData): Promise<DictionaryImport | undefined> {
		const { data } = await tryExecuteAndNotify(
			this.host,
			DictionaryResource.postDictionaryUpload({
				requestBody: formData,
			})
		);

		return data;
	}

	/// TODO => refresh tree and potentially dashboard after importing
	async import(file: string, parentId?: number): Promise<ContentResult | undefined> {
		// TODO => parentKey will be a guid param once #13786 is merged and API regenerated
		const { data } = await tryExecuteAndNotify(this.host, DictionaryResource.postDictionaryImport({ file, parentId }));
		return data;
	}

	// TODO => temp until language service exists. Need languages as the dictionary response
	// includes the translated iso codes only, no friendly names and no way to tell if a dictionary
	// is missing a translation
	async getLanguages() {
		const { data } = await tryExecuteAndNotify(this.host, LanguageResource.getLanguage({ skip: 0, take: 1000 }));

		// default first, then sorted by name
		// easier to unshift than conditionally sorting by bool and string
		const languages = data?.items.sort((a, b) => {
			a.name = a.name ?? '';
			b.name = b.name ?? '';
			return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
		}) ?? [];

		const defaultIndex = languages.findIndex((x) => x.isDefault);
		languages.unshift(...languages.splice(defaultIndex, 1));

		return languages;
	}
}
