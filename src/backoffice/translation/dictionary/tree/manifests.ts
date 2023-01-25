import { UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN } from '../dictionary.tree.store';
import type { ManifestTree, ManifestTreeItemAction } from '@umbraco-cms/models';

const treeAlias = 'Umb.Tree.Dictionary';

const tree: ManifestTree = {
	type: 'tree',
	alias: treeAlias,
	name: 'Dictionary Tree',
	weight: 100,
	meta: {
		storeAlias: UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN.toString(),
	},
};

const treeItemActions: Array<ManifestTreeItemAction> = [
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Create',
		name: 'Tree Item Action Create',
		loader: () => import('./actions/action-dictionary-create.element'),
		weight: 200,
		meta: {
			entityType: 'dictionary',
			label: 'Create',
			icon: 'umb:add',
		},
	},
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Move',
		name: 'Tree Item Action Move',
		loader: () => import('./actions/action-dictionary-move.element'),
		weight: 200,
		meta: {
			entityType: 'dictionary',
			label: 'Move',
			icon: 'umb:enter',
			
		},
	},
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Export',
		name: 'Tree Item Action Export',
		loader: () => import('./actions/action-dictionary-export.element'),
		weight: 200,
		meta: {
			entityType: 'dictionary',
			label: 'Export',
			icon: 'umb:download-alt',
		},
	},
	// TODO => this doesn't live here, temp until section-root actions exist
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Import',
		name: 'Tree Item Action Import',
		loader: () => import('./actions/action-dictionary-import.element'),
		weight: 200,
		meta: {
			entityType: 'dictionary',
			label: 'Import',
			icon: 'umb:page-up',
		},
	},
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Delete',
		name: 'Tree Item Action Delete',
		loader: () => import('./actions/action-dictionary-delete.element'),
		weight: 100,
		meta: {
			entityType: 'dictionary',
			label: 'Delete',
			icon: 'umb:trash',
		},
	},
	{
		type: 'treeItemAction',
		alias: 'Umb.TreeItemAction.Dictionary.Reload',
		name: 'Tree Item Action Reload',
		loader: () => import('./actions/action-dictionary-reload.element'),
		weight: 200,
		meta: {
			entityType: 'dictionary',
			label: 'Reload',
			icon: 'umb:refresh',
		},
	},
];

export const manifests = [tree, ...treeItemActions];
