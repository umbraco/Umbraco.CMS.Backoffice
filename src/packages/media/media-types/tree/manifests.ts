import { MEDIA_TYPE_REPOSITORY_ALIAS } from '../repository/manifests.js';
import type { ManifestTree, ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';

const tree: ManifestTree = {
	type: 'tree',
	alias: 'Umb.Tree.MediaTypes',
	name: 'Media Types Tree',
	meta: {
		repositoryAlias: MEDIA_TYPE_REPOSITORY_ALIAS,
	},
};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'entity',
	alias: 'Umb.TreeItem.MediaType',
	name: 'Media Type Tree Item',
	conditions: {
		entityTypes: ['media-type-root', 'media-type'],
	},
};

export const manifests = [tree, treeItem];
