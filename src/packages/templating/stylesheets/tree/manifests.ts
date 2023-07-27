import { STYLESHEET_ENTITY_TYPE } from '../index.js';
import { STYLESHEET_REPOSITORY_ALIAS } from '../repository/manifests.js';
import type { ManifestTree, ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';

export const STYLESHEET_TREE_ALIAS = 'Umb.Tree.Stylesheet';

const tree: ManifestTree = {
	type: 'tree',
	alias: STYLESHEET_TREE_ALIAS,
	name: 'Stylesheet Tree',
	weight: 10,
	meta: {
		repositoryAlias: STYLESHEET_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'fileSystem',
	alias: 'Umb.TreeItem.Stylesheet',
	name: 'Stylesheet Tree Item',
	conditions: {
		entityTypes: ['stylesheet-root', STYLESHEET_ENTITY_TYPE],
	},
};

export const manifests = [tree, treeItem];
