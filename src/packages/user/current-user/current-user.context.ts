import type { UmbCurrentUserModel } from './types.js';
import { UmbCurrentUserRepository } from './repository/index.js';
import { UMB_CURRENT_USER_CONTEXT } from './current-user.context.token.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { filter, firstValueFrom } from '@umbraco-cms/backoffice/external/rxjs';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { umbLocalizationRegistry } from '@umbraco-cms/backoffice/localization';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_SECTION_PATH_PATTERN } from '@umbraco-cms/backoffice/section';
import { UMB_APP_CONTEXT } from '@umbraco-cms/backoffice/app';
import { ensurePathEndsWithSlash } from '@umbraco-cms/backoffice/utils';

export class UmbCurrentUserContext extends UmbContextBase<UmbCurrentUserContext> {
	#currentUser = new UmbObjectState<UmbCurrentUserModel | undefined>(undefined);
	readonly currentUser = this.#currentUser.asObservable().pipe(filter((user) => !!user));
	readonly allowedSections = this.#currentUser.asObservablePart((user) => user?.allowedSections);
	readonly avatarUrls = this.#currentUser.asObservablePart((user) => user?.avatarUrls);
	readonly documentStartNodeUniques = this.#currentUser.asObservablePart((user) => user?.documentStartNodeUniques);
	readonly email = this.#currentUser.asObservablePart((user) => user?.email);
	readonly fallbackPermissions = this.#currentUser.asObservablePart((user) => user?.fallbackPermissions);
	readonly hasAccessToAllLanguages = this.#currentUser.asObservablePart((user) => user?.hasAccessToAllLanguages);
	readonly hasAccessToSensitiveData = this.#currentUser.asObservablePart((user) => user?.hasAccessToSensitiveData);
	readonly hasDocumentRootAccess = this.#currentUser.asObservablePart((user) => user?.hasDocumentRootAccess);
	readonly hasMediaRootAccess = this.#currentUser.asObservablePart((user) => user?.hasMediaRootAccess);
	readonly isAdmin = this.#currentUser.asObservablePart((user) => user?.isAdmin);
	readonly languageIsoCode = this.#currentUser.asObservablePart((user) => user?.languageIsoCode);
	readonly languages = this.#currentUser.asObservablePart((user) => user?.languages);
	readonly mediaStartNodeUniques = this.#currentUser.asObservablePart((user) => user?.mediaStartNodeUniques);
	readonly name = this.#currentUser.asObservablePart((user) => user?.name);
	readonly permissions = this.#currentUser.asObservablePart((user) => user?.permissions);
	readonly unique = this.#currentUser.asObservablePart((user) => user?.unique);
	readonly userName = this.#currentUser.asObservablePart((user) => user?.userName);

	#authContext?: typeof UMB_AUTH_CONTEXT.TYPE;
	#currentUserRepository = new UmbCurrentUserRepository(this);

	constructor(host: UmbControllerHost) {
		super(host, UMB_CURRENT_USER_CONTEXT);

		this.consumeContext(UMB_AUTH_CONTEXT, (instance) => {
			this.#authContext = instance;
			this.#observeIsAuthorized();
		});

		this.observe(this.languageIsoCode, (currentLanguageIsoCode) => {
			if (!currentLanguageIsoCode) return;
			umbLocalizationRegistry.loadLanguage(currentLanguageIsoCode);
		});
	}

	/**
	 * Loads the current user
	 */
	async load() {
		const { asObservable } = await this.#currentUserRepository.requestCurrentUser();

		if (asObservable) {
			this.observe(asObservable(), (currentUser) => {
				this.#currentUser?.setValue(currentUser);
				this.#redirectToFirstAllowedSectionIfNeeded();
			});
		}
	}

	/**
	 * Checks if a user is the current user.
	 * @param userUnique The user id to check
	 * @returns True if the user is the current user, otherwise false
	 */
	async isUserCurrentUser(userUnique: string): Promise<boolean> {
		const currentUser = await firstValueFrom(this.currentUser);
		return currentUser?.unique === userUnique;
	}

	/**
	 * Checks if the current user is an admin.
	 * @returns True if the current user is an admin, otherwise false
	 */
	async isCurrentUserAdmin(): Promise<boolean> {
		const currentUser = await firstValueFrom(this.currentUser);
		return currentUser?.isAdmin ?? false;
	}

	#observeIsAuthorized() {
		if (!this.#authContext) return;
		this.observe(this.#authContext.isAuthorized, (isAuthorized) => {
			if (isAuthorized) {
				this.load();
			}
		});
	}

	async #redirectToFirstAllowedSectionIfNeeded() {
		const url = new URL(window.location.href);

		const appContext = await this.getContext(UMB_APP_CONTEXT);
		const backofficePath = appContext.getBackofficePath();

		if (url.pathname === backofficePath || url.pathname === ensurePathEndsWithSlash(backofficePath)) {
			const sectionManifest = await this.#firstAllowedSection();
			if (!sectionManifest) return;

			const fallbackSectionPath = UMB_SECTION_PATH_PATTERN.generateLocal({
				sectionName: sectionManifest.meta.pathname,
			});

			history.pushState(null, '', fallbackSectionPath);
		}
	}

	async #firstAllowedSection() {
		const currentUser = this.#currentUser.getValue();
		if (!currentUser) return;

		/* TODO: this solution is not bullet proof as we still rely on the "correct" section to be registered at this point in time so we can get the path.
		 It probably would have been better if we used the section alias instead as the path.
		 Then we would have it available at all times and it also ensured a unique path. */
		const sections = await this.observe(
			umbExtensionsRegistry.byTypeAndAliases('section', currentUser.allowedSections),
			() => {},
		).asPromise();

		return sections[0];
	}
}

export default UmbCurrentUserContext;
