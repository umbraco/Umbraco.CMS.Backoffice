import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemRepositoryBase } from '@umbraco-cms/backoffice/repository';
import { UmbLanguageItemServerDataSource } from './language-item.server.data-source.js';
import type { UmbLanguageItemModel } from './types.js';
import { UMB_LANGUAGE_ITEM_STORE_CONTEXT } from './language-item.store.context-token.js';

export class UmbLanguageItemRepository extends UmbItemRepositoryBase<UmbLanguageItemModel> {
	constructor(host: UmbControllerHost) {
		super(host, UmbLanguageItemServerDataSource, UMB_LANGUAGE_ITEM_STORE_CONTEXT);
	}
}
export default UmbLanguageItemRepository;
