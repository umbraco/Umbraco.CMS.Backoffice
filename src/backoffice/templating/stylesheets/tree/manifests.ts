import { UMB_STYLESHEET_STORE_CONTEXT_TOKEN } from '../stylesheets.store';
import type { ManifestTree, ManifestTreeItemAction } from '@umbraco-cms/models';

const tree: ManifestTree = {
	type: 'tree',
	alias: 'Umb.Tree.Stylesheets',
	name: 'Stylesheets Tree',
	meta: {
		storeAlias: UMB_STYLESHEET_STORE_CONTEXT_TOKEN.toString(),
	},
};

const treeItemActions: Array<ManifestTreeItemAction> = [];

export const manifests = [tree, ...treeItemActions];
