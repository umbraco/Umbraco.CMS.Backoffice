import { UmbDictionaryTreeStore, UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN } from '../../tree/data/dictionary.tree.store';
import { UmbDictionaryDetailStore, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from './dictionary.detail.store';
import { UmbDictionaryDetailServerDataSource } from './sources/dictionary.detail.server.data';
import { DictionaryItem, ProblemDetails } from '@umbraco-cms/backend-api';
import { UmbContextConsumerController } from '@umbraco-cms/context-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { UmbNotificationService, UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN } from '@umbraco-cms/notification';

export class UmbDictionaryDetailRepository {
	#host: UmbControllerHostInterface;
	#dataSource: UmbDictionaryDetailServerDataSource;
	#detailStore?: UmbDictionaryDetailStore;
	#treeStore?: UmbDictionaryTreeStore;
	#notificationService?: UmbNotificationService;
	#initResolver?: () => void;
	#initialized = false;

	constructor(host: UmbControllerHostInterface) {
		this.#host = host;

		this.#dataSource = new UmbDictionaryDetailServerDataSource(this.#host);

		new UmbContextConsumerController(this.#host, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (detailStore) => {
			this.#detailStore = detailStore;
			this.#checkIfInitialized();
		});

		new UmbContextConsumerController(this.#host, UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN, (treeStore) => {
			this.#treeStore = treeStore;
			this.#checkIfInitialized();
		});

		new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN, (notificationService) => {
			this.#notificationService = notificationService;
			this.#checkIfInitialized();
		});
	}

	#init() {
		// TODO: This would only works with one user of this method. If two, the first one would be forgotten, but maybe its alright for now as I guess this is temporary.
		return new Promise<void>((resolve) => {
			this.#initialized ? resolve() : (this.#initResolver = resolve);
		});
	}

	#checkIfInitialized() {
		if (this.#detailStore && this.#detailStore && this.#notificationService) {
			this.#initialized = true;
			this.#initResolver?.();
		}
	}

	async createScaffold(parentKey: string | null) {
		await this.#init();

		if (!parentKey) {
			const error: ProblemDetails = { title: 'Parent key is missing' };
			return { data: undefined, error };
		}

		return this.#dataSource.createScaffold(parentKey);
	}

	async getByKey(key: string) {
		await this.#init();

		// TODO: should we show a notification if the key is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		// TODO: return error here or in data source? Lower is better?
		if (!key) {
			const error: ProblemDetails = { title: 'Key is missing' };
			return { error };
		}

		return this.#dataSource.getByKey(key);
	}

	async get(skip = 0, take = 1000) {
		await this.#init();
		return this.#dataSource.get(skip, take);
	}

    async delete(key: string) {
        await this.#init();
        return this.#dataSource.delete(key);
    }

	async update(dictionary: DictionaryItem) {
		await this.#init();

		// TODO: should we show a notification if the dictionary is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!dictionary || !dictionary.key) {
			const error: ProblemDetails = { title: 'Dictionary is missing' };
			return { error };
		}

		const { error } = await this.#dataSource.update(dictionary);

		if (!error) {
			const notification = { data: { message: `Dictionary saved` } };
			this.#notificationService?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		// Consider notify a workspace if a dictionary is updated in the store while someone is editing it.
		this.#detailStore?.append(dictionary);
		this.#treeStore?.updateItem(dictionary.key, { name: dictionary.name });
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	async insert(dictionary: DictionaryItem) {
		await this.#init();

		// TODO: should we show a notification if the template is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!dictionary) {
			const error: ProblemDetails = { title: 'Dictionary is missing' };
			return { error };
		}

		const { error } = await this.#dataSource.insert(dictionary);

		if (!error) {
			const notification = { data: { message: `Dictionary created` } };
			this.#notificationService?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		this.#detailStore?.append(dictionary);
		// TODO: Update tree store with the new item?

		return { error };
	}

	async export(key: string, includeChildren = false) {
		await this.#init();

		if (!key) {
			const error: ProblemDetails = { title: 'Key is missing' };
			return { error };
		}

		return this.#dataSource.export(key, includeChildren);
	}

	async import(file: string, parentId?: number) {
		await this.#init();

		if (!file) {
			const error: ProblemDetails = { title: 'File is missing' };
			return { error };
		}

		return this.#dataSource.import(file, parentId);
	}

	async upload(formData: FormData) {
		await this.#init();

		if (!formData) {
			const error: ProblemDetails = { title: 'Form data is missing' };
			return { error };
		}

		return this.#dataSource.upload(formData);
	}

    // TODO => temporary only, until languages data source exists, or might be
    // ok to keep, as it reduces downstream dependencies
	async getLanguages() {
		await this.#init();

		const { data } = await this.#dataSource.getLanguages();

		// default first, then sorted by name
		// easier to unshift than conditionally sorting by bool and string
		const languages =
			data?.items.sort((a, b) => {
				a.name = a.name ?? '';
				b.name = b.name ?? '';
				return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
			}) ?? [];

		const defaultIndex = languages.findIndex((x) => x.isDefault);
		languages.unshift(...languages.splice(defaultIndex, 1));

		return languages;
	}
}
