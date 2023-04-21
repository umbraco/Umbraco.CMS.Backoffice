import { UmbLanguageRepository } from '../repository/language.repository';
import { UmbLanguageStore } from './language.store';
import { UmbLanguageItemStore } from './language-item.store';
import type { ManifestStore, ManifestRepository } from '@umbraco-cms/backoffice/extensions-registry';

export const LANGUAGE_REPOSITORY_ALIAS = 'Umb.Repository.Language';

const repository: ManifestRepository = {
	type: 'repository',
	alias: LANGUAGE_REPOSITORY_ALIAS,
	name: 'Languages Repository',
	class: UmbLanguageRepository,
};

export const LANGUAGE_STORE_ALIAS = 'Umb.Store.Language';
export const LANGUAGE_ITEM_STORE_ALIAS = 'Umb.Store.LanguageItem';

const store: ManifestStore = {
	type: 'store',
	alias: LANGUAGE_STORE_ALIAS,
	name: 'Language Store',
	class: UmbLanguageStore,
};

const itemStore = {
	type: 'itemStore',
	alias: LANGUAGE_ITEM_STORE_ALIAS,
	name: 'Language Item Store',
	class: UmbLanguageItemStore,
};

export const manifests = [repository, store, itemStore];
