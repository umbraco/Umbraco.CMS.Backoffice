import { UmbDocumentTypeItemRepository } from './document-type-item.repository.js';
import { UmbDocumentTypeItemStore } from './document-type-item.store.js';
import type { ManifestItemStore, ManifestRepository, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DOCUMENT_TYPE_ITEM_REPOSITORY_ALIAS = 'Umb.Repository.DocumentType.Item';
export const UMB_DOCUMENT_TYPE_ITEM_STORE_ALIAS = 'Umb.Store.DocumentType.Item';

const itemRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_DOCUMENT_TYPE_ITEM_REPOSITORY_ALIAS,
	name: 'Document Type Item Repository',
	api: UmbDocumentTypeItemRepository,
};

const itemStore: ManifestItemStore = {
	type: 'itemStore',
	alias: UMB_DOCUMENT_TYPE_ITEM_STORE_ALIAS,
	name: 'Document Type Item Store',
	api: UmbDocumentTypeItemStore,
};

export const manifests: Array<ManifestTypes> = [itemRepository, itemStore];
