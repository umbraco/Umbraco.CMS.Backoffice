import { UmbTemplateRepository } from '../repository/partial-views.repository';
import { PARTIAL_VIEW_REPOSITORY_ALIAS } from '../config';
import { UmbPartialViewsTreeStore } from './partial-views.tree.store';
import { UmbPartialViewsStore } from './partial-views.store';
import { ManifestRepository, ManifestStore, ManifestTreeStore } from '@umbraco-cms/backoffice/extensions-registry';


const repository: ManifestRepository = {
	type: 'repository',
	alias: PARTIAL_VIEW_REPOSITORY_ALIAS,
	name: 'Partial Views Repository',
	class: UmbTemplateRepository,
};

export const PARTIAL_VIEW_STORE_ALIAS = 'Umb.Store.PartialViews';
export const PARTIAL_VIEW_TREE_STORE_ALIAS = 'Umb.Store.PartialViewsTree';

const store: ManifestStore = {
	type: 'store',
	alias: PARTIAL_VIEW_STORE_ALIAS,
	name: 'Partial Views Store',
	class: UmbPartialViewsStore,
};

const treeStore: ManifestTreeStore = {
	type: 'treeStore',
	alias: PARTIAL_VIEW_TREE_STORE_ALIAS,
	name: 'Partial Views Tree Store',
	class: UmbPartialViewsTreeStore,
};

export const manifests = [repository, store, treeStore];
