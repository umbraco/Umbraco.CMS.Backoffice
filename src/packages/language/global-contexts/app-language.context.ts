import { UmbLanguageCollectionRepository } from '../collection/index.js';
import type { UmbLanguageDetailModel } from '../types.js';
import { UmbArrayState, UmbObjectState, createObservablePart } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

// TODO: Make a store for the App Languages.
// TODO: Implement default language end-point, in progress at backend team, so we can avoid getting all languages.
export class UmbAppLanguageContext extends UmbContextBase<UmbAppLanguageContext> implements UmbApi {
	#languageCollectionRepository: UmbLanguageCollectionRepository;
	#languages = new UmbArrayState<UmbLanguageDetailModel>([], (x) => x.unique);

	#appLanguage = new UmbObjectState<UmbLanguageDetailModel | undefined>(undefined);
	appLanguage = this.#appLanguage.asObservable();

	appLanguageCulture = this.#appLanguage.asObservablePart((x) => x?.unique);

	appDefaultLanguage = createObservablePart(this.#languages.asObservable(), (languages) =>
		languages.find((language) => language.isDefault),
	);

	getAppCulture() {
		return this.#appLanguage.getValue()?.unique;
	}

	constructor(host: UmbControllerHost) {
		super(host, UMB_APP_LANGUAGE_CONTEXT);
		this.#languageCollectionRepository = new UmbLanguageCollectionRepository(this);
		this.#observeLanguages();
	}

	setLanguage(unique: string) {
		const languages = this.#languages.getValue();
		const language = languages.find((x) => x.unique === unique);
		this.#appLanguage.update(language);
	}

	async #observeLanguages() {
		const { data } = await this.#languageCollectionRepository.requestCollection({});

		// TODO: make this observable / update when languages are added/removed/updated
		if (data) {
			this.#languages.setValue(data.items);

			// If the app language is not set, set it to the default language
			if (!this.#appLanguage.getValue()) {
				this.#initAppLanguage();
			}
		}
	}

	#initAppLanguage() {
		const defaultLanguage = this.#languages.getValue().find((x) => x.isDefault);
		// TODO: do we always have a default language?
		// do we always get the default language on the first request, or could it be on page 2?
		// in that case do we then need an endpoint to get the default language?
		if (!defaultLanguage?.unique) return;
		this.setLanguage(defaultLanguage.unique);
	}
}

// Default export to enable this as a globalContext extension js:
export default UmbAppLanguageContext;

export const UMB_APP_LANGUAGE_CONTEXT = new UmbContextToken<UmbAppLanguageContext>('UmbAppLanguageContext');
