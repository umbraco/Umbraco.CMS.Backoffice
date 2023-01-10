import type { ManifestTree, ManifestTreeItemAction } from '@umbraco-cms/models';

const treeAlias = 'Umb.Tree.Dictionary';

const tree: ManifestTree = {
	type: 'tree',
	alias: treeAlias,
	name: 'Dictionary Tree',
	weight: 100,
	meta: {
		label: 'Dictionary',
		icon: 'umb:folder',
		sections: ['Umb.Section.Translation'],
		storeAlias: 'umbDictionaryStore',
	},
};

const treeItemActions: Array<ManifestTreeItemAction> = [{
	type: 'treeItemAction',
	alias: 'Umb.TreeItemAction.Translation.Create',
	name: 'Tree Item Action Create',
	loader: () => import('./actions/create/action-dictionary-create.element'),
	weight: 200,
	meta: {
		trees: [treeAlias],
		label: 'Create',
		icon: 'umb:add',
	},
},
{
	type: 'treeItemAction',
	alias: 'Umb.TreeItemAction.Translation.Delete',
	name: 'Tree Item Action Delete',
	loader: () => import('./actions/delete/action-dictionary-delete.element'),
	weight: 100,
	meta: {
		trees: [treeAlias],
		label: 'Delete',
		icon: 'umb:delete',
	},
},];

export const manifests = [tree, ...treeItemActions];
