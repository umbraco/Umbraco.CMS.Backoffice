import { DictionaryDetailDataSource } from '.';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { DictionaryItem, DictionaryResource, LanguageResource, ProblemDetails } from '@umbraco-cms/backend-api';

/**
 * @description - A data source for the Dictionary detail that fetches data from the server
 * @export
 * @class UmbDictionaryDetailServerDataSource
 * @implements {DictionaryDetailDataSource}
 */
export class UmbDictionaryDetailServerDataSource implements DictionaryDetailDataSource {
	#host: UmbControllerHostInterface;

	constructor(host: UmbControllerHostInterface) {
		this.#host = host;
	}

	/**
	 * @description - Creates a new Dictionary scaffold
	 * @param {string} parentKey
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async createScaffold(parentKey: string) {
		const data: DictionaryItem = {};
		return { data };
	}
	/**
	 * @description - Fetches a Dictionary with the given key from the server
	 * @param {string} key
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	getByKey(key: string) {
		return tryExecuteAndNotify(this.#host, DictionaryResource.getDictionaryByKey({ key }));
	}

    /**
     * @description - Get the dictionary overview
     * @param {number?} skip 
     * @param {number?} take 
     * @returns {*}
     */
	get(skip = 0, take = 1000) {
		return tryExecuteAndNotify(this.#host, DictionaryResource.getDictionary({ skip, take }));
	}

	/**
	 * @description - Updates a Dictionary on the server
	 * @param {DictionaryItem} dictionary
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async update(dictionary: DictionaryItem) {
		if (!dictionary.key) {
			const error: ProblemDetails = { title: 'Dictionary key is missing' };
			return { error };
		}

		const payload = { key: dictionary.key, requestBody: dictionary };
		return tryExecuteAndNotify(this.#host, DictionaryResource.putDictionaryByKey(payload));
	}

	/**
	 * @description - Inserts a new Dictionary on the server
	 * @param {DictionaryItem} dictionary
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async insert(dictionary: DictionaryItem) {
		const payload = { requestBody: dictionary };
		return tryExecuteAndNotify(this.#host, DictionaryResource.postDictionary(payload));
	}

	/**
	 * @description - Deletes a Dictionary on the server
	 * @param {string} key
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async delete(key: string) {
		if (!key) {
			const error: ProblemDetails = { title: 'Key is missing' };
			return { error };
		}

		return await tryExecuteAndNotify(this.#host, DictionaryResource.deleteDictionaryByKey({ key }));
	}

	/**
	 * @description - Import a dictionary
	 * @param {string} file
	 * @param {number?} parentId
	 * @returns {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async import(file: string, parentId?: number) {
		// TODO => parentKey will be a guid param once #13786 is merged and API regenerated
		return await tryExecuteAndNotify(this.#host, DictionaryResource.postDictionaryImport({ file, parentId }));
	}

	/**
	 * @description - Upload a Dictionary
	 * @param {FormData} formData
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async upload(formData: FormData) {
		return await tryExecuteAndNotify(
			this.#host,
			DictionaryResource.postDictionaryUpload({
				requestBody: formData,
			})
		);
	}

	/**
	 * @description - Export a Dictionary, optionally including child items.
	 * @param {string} key
	 * @param {boolean} includeChildren
	 * @return {*}
	 * @memberof UmbDictionaryDetailServerDataSource
	 */
	async export(key: string, includeChildren: boolean) {
		return await tryExecuteAndNotify(this.#host, DictionaryResource.getDictionaryExportByKey({ key, includeChildren }));
	}

    
	async getLanguages() {
		// TODO => temp until language service exists. Need languages as the dictionary response
		// includes the translated iso codes only, no friendly names and no way to tell if a dictionary
		// is missing a translation
		return await tryExecuteAndNotify(this.#host, LanguageResource.getLanguage({ skip: 0, take: 1000 }));
	}
}
