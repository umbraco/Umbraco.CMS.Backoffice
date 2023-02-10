import { UmbDictionaryDetailRepository } from './data/dictionary.detail.repository';
import { DictionaryItem, DictionaryItemTranslationModel } from '@umbraco-cms/backend-api';
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

	setTranslations(value: Array<DictionaryItemTranslationModel>) {
		this.#data.next({ ...this.#data.value, translations: value });
	}

	setTranslation(isoCode: string, translation: string) {
		if (!this.#data.value) return;

		// update if the code already exists
		const value = this.#data.value.translations?.map((translationItem) => {
			if (translationItem.isoCode === isoCode) {
				return { ...translationItem, translation };
			}
			return translationItem;
		}) ?? [];

		// if code doesn't exist, add it to the new value set
		if (!value?.find((x) => x.isoCode === isoCode)) {
			value?.push({ isoCode, translation });
		}

		this.#data.next({ ...this.#data.value, translations: value });
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
