import { UmbDocumentTypeDetailRepository } from './document-type-detail.repository.js';
import { UmbDocumentTypeDetailStore } from './document-type-detail.store.js';
import type { ManifestRepository, ManifestStore } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DOCUMENT_TYPE_DETAIL_REPOSITORY_ALIAS = 'Umb.Repository.DocumentType.Detail';
export const UMB_DOCUMENT_TYPE_DETAIL_STORE_ALIAS = 'Umb.Store.DocumentType.Detail';

const detailRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_DOCUMENT_TYPE_DETAIL_REPOSITORY_ALIAS,
	name: 'Document Types Repository',
	api: UmbDocumentTypeDetailRepository,
};

const detailStore: ManifestStore = {
	type: 'store',
	alias: UMB_DOCUMENT_TYPE_DETAIL_STORE_ALIAS,
	name: 'Document Type Store',
	api: UmbDocumentTypeDetailStore,
};

export const manifests = [detailRepository, detailStore];
