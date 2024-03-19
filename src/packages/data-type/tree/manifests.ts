import { manifests as folderManifests } from './folder/manifests.js';
import { manifests as reloadManifests } from './reload-tree-item-children/manifests.js';
import { UmbDataTypeTreeRepository } from './data-type-tree.repository.js';
import { UmbDataTypeTreeStore } from './data-type-tree.store.js';
import type {
	ManifestRepository,
	ManifestTree,
	ManifestTreeItem,
	ManifestTreeStore,
} from '@umbraco-cms/backoffice/extension-registry';

export const UMB_DATA_TYPE_TREE_REPOSITORY_ALIAS = 'Umb.Repository.DataType.Tree';
export const UMB_DATA_TYPE_TREE_STORE_ALIAS = 'Umb.Store.DataType.Tree';

const treeRepository: ManifestRepository = {
	type: 'repository',
	alias: UMB_DATA_TYPE_TREE_REPOSITORY_ALIAS,
	name: 'Data Type Tree Repository',
	api: UmbDataTypeTreeRepository,
};

const treeStore: ManifestTreeStore = {
	type: 'treeStore',
	alias: UMB_DATA_TYPE_TREE_STORE_ALIAS,
	name: 'Data Type Tree Store',
	api: UmbDataTypeTreeStore,
};

const tree: ManifestTree = {
	type: 'tree',
	kind: 'default',
	alias: 'Umb.Tree.DataType',
	name: 'Data Types Tree',
	meta: {
		repositoryAlias: UMB_DATA_TYPE_TREE_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'default',
	alias: 'Umb.TreeItem.DataType',
	name: 'Data Type Tree Item',
	forEntityTypes: ['data-type-root', 'data-type', 'data-type-folder'],
};

export const manifests = [treeRepository, treeStore, tree, treeItem, ...folderManifests, ...reloadManifests];
