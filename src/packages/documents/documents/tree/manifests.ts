import { UMB_DOCUMENT_ENTITY_TYPE, UMB_DOCUMENT_ROOT_ENTITY_TYPE } from '../entity.js';
import { manifests as reloadTreeItemChildrenManifests } from './reload-tree-item-children/manifests.js';
import { UmbDocumentTreeItemContext } from './tree-item/document-tree-item.context.js';
import type {
	ManifestRepository,
	ManifestTree,
	ManifestTreeItem,
	ManifestTreeStore,
	ManifestTypes,
} from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DOCUMENT_TREE_REPOSITORY_ALIAS = 'Umb.Repository.Document.Tree';
export const UMB_DOCUMENT_TREE_STORE_ALIAS = 'Umb.Store.Document.Tree';
export const UMB_DOCUMENT_TREE_ALIAS = 'Umb.Tree.Document';

const treeRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_DOCUMENT_TREE_REPOSITORY_ALIAS,
	name: 'Document Tree Repository',
	api: () => import('./document-tree.repository.js'),
};

const treeStore: ManifestTreeStore = {
	type: 'treeStore',
	alias: UMB_DOCUMENT_TREE_STORE_ALIAS,
	name: 'Document Tree Store',
	api: () => import('./document-tree.store.js'),
};

const tree: ManifestTree = {
	type: 'tree',
	alias: UMB_DOCUMENT_TREE_ALIAS,
	name: 'Document Tree',
	api: () => import('./document-tree.context.js'),
	element: () => import('./document-tree.element.js'),
	meta: {
		repositoryAlias: UMB_DOCUMENT_TREE_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	alias: 'Umb.TreeItem.Document',
	name: 'Document Tree Item',
	element: () => import('./tree-item/document-tree-item.element.js'),
	api: UmbDocumentTreeItemContext,
	forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
};

const rootTreeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'default',
	alias: 'Umb.TreeItem.Document.Root',
	name: 'Document Tree Root',
	forEntityTypes: [UMB_DOCUMENT_ROOT_ENTITY_TYPE],
};

export const manifests: Array<ManifestTypes> = [
	...reloadTreeItemChildrenManifests,
	tree,
	treeItem,
	rootTreeItem,
	treeRepository,
	treeStore,
];
