import { UmbDocumentRepository } from '../repository/document.repository.js';
import { UmbDocumentStore } from './document.store.js';
import { UmbDocumentTreeStore } from './document.tree.store.js';
import type { ManifestRepository, ManifestStore, ManifestTreeStore } from '@umbraco-cms/backoffice/extension-registry';

export const DOCUMENT_REPOSITORY_ALIAS = 'Umb.Repository.Document';

const repository: ManifestRepository = {
	type: 'repository',
	alias: DOCUMENT_REPOSITORY_ALIAS,
	name: 'Documents Repository',
	class: UmbDocumentRepository,
};

export const DOCUMENT_STORE_ALIAS = 'Umb.Store.Document';
export const DOCUMENT_TREE_STORE_ALIAS = 'Umb.Store.DocumentTree';

const store: ManifestStore = {
	type: 'store',
	alias: DOCUMENT_STORE_ALIAS,
	name: 'Document Store',
	class: UmbDocumentStore,
};

const treeStore: ManifestTreeStore = {
	type: 'treeStore',
	alias: DOCUMENT_TREE_STORE_ALIAS,
	name: 'Document Tree Store',
	class: UmbDocumentTreeStore,
};

export const manifests = [repository, store, treeStore];
