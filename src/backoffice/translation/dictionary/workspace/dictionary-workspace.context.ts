import { UmbDictionaryDetailRepository } from './data/dictionary.detail.repository';
import { DictionaryItem } from '@umbraco-cms/backend-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { createObservablePart, DeepState } from '@umbraco-cms/observable-api';

export class UmbWorkspaceDictionaryContext {
	#host: UmbControllerHostInterface;
	#detailRepo: UmbDictionaryDetailRepository;

	#data = new DeepState<DictionaryItem | undefined>(undefined);
	data = this.#data.asObservable();
	name = createObservablePart(this.#data, (data) => data?.name);
	dictionary = createObservablePart(this.#data, (data) => data);

	constructor(host: UmbControllerHostInterface) {
		this.#host = host;
		this.#detailRepo = new UmbDictionaryDetailRepository(this.#host);
	}

	setName(value: string) {
		this.#data.next({ ...this.#data.value, name: value });
	}

	setValue(dictionary: DictionaryItem) {
		this.#data.next({ ...this.#data.value, translations: dictionary.translations });
	}

	async load(entityKey: string) {
		const { data } = await this.#detailRepo.getByKey(entityKey);
		if (data) {
			this.#data.next(data);
		}
	}	

	async createScaffold(parentKey: string | null) {
		const { data } = await this.#detailRepo.createScaffold(parentKey);
		if (!data) return;
		this.#data.next(data);
	}

	async save() {
		if (!this.#data.value) return;
		this.#detailRepo.update(this.#data.value);
	}
}
