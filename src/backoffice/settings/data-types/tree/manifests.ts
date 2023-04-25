import { DATA_TYPE_REPOSITORY_ALIAS } from '../repository/manifests';
import type { ManifestTree, ManifestTreeItem } from '@umbraco-cms/backoffice/extensions-registry';

const tree: ManifestTree = {
	type: 'tree',
	alias: 'Umb.Tree.DataTypes',
	name: 'Data Types Tree',
	meta: {
		repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'entity',
	alias: 'Umb.TreeItem.DataType',
	name: 'Data Type Tree Item',
	conditions: {
		entityType: 'data-type',
	},
};

const rootTreeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'entity',
	alias: 'Umb.TreeItem.DataTypeRoot',
	name: 'Data Type Root Tree Item',
	conditions: {
		entityType: 'data-type-root',
	},
};

export const manifests = [tree, treeItem, rootTreeItem];
