import { RELATION_TYPE_REPOSITORY_ALIAS } from '../repository/manifests.js';
import type { ManifestTree, ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';

const tree: ManifestTree = {
	type: 'tree',
	alias: 'Umb.Tree.RelationTypes',
	name: 'Relation Types Tree',
	meta: {
		repositoryAlias: RELATION_TYPE_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'entity',
	alias: 'Umb.TreeItem.RelationType',
	name: 'Relation Type Tree Item',
	meta: {
		entityTypes: ['relation-type-root', 'relation-type'],
	},
};

export const manifests = [tree, treeItem];
