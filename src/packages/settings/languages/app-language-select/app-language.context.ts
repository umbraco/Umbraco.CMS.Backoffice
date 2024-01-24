import { UmbLanguageRepository } from '../repository/language.repository.js';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { type UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { LanguageResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class UmbAppLanguageContext extends UmbBaseController implements UmbApi {
	#languageRepository: UmbLanguageRepository;

	#languages: Array<LanguageResponseModel> = [];

	#appLanguage = new UmbObjectState<LanguageResponseModel | undefined>(undefined);
	appLanguage = this.#appLanguage.asObservable();

	constructor(host: UmbControllerHost) {
		super(host);

		this.provideContext(UMB_APP_LANGUAGE_CONTEXT, this);

		this.#languageRepository = new UmbLanguageRepository(this);
		this.#observeLanguages();
	}

	setLanguage(isoCode: string) {
		const language = this.#languages.find((x) => x.isoCode === isoCode);
		this.#appLanguage.update(language);
	}

	async #observeLanguages() {
		const { asObservable } = await this.#languageRepository.requestLanguages();

		this.observe(
			asObservable(),
			(languages) => {
				this.#languages = languages;

				// If the app language is not set, set it to the default language
				if (!this.#appLanguage.getValue()) {
					this.#initAppLanguage();
				}
			},
			'_observeLanguages',
		);
	}

	#initAppLanguage() {
		const defaultLanguage = this.#languages.find((x) => x.isDefault);
		// TODO: do we always have a default language?
		// do we always get the default language on the first request, or could it be on page 2?
		// in that case do we then need an endpoint to get the default language?
		if (!defaultLanguage?.isoCode) return;
		this.setLanguage(defaultLanguage.isoCode);
	}
}

// Default export to enable this as a globalContext extension js:
export default UmbAppLanguageContext;

export const UMB_APP_LANGUAGE_CONTEXT = new UmbContextToken<UmbAppLanguageContext>('UmbAppLanguageContext');
