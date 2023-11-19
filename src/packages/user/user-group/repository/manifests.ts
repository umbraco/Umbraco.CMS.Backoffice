import { UmbUserGroupRepository } from './user-group.repository.js';
import { UmbUserGroupItemStore } from './user-group-item.store.js';
import { UmbUserGroupStore } from './user-group.store.js';
import type { ManifestStore, ManifestRepository, ManifestItemStore } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_USER_GROUP_REPOSITORY_ALIAS = 'Umb.Repository.UserGroup';

const repository: ManifestRepository = {
	type: 'repository',
	alias: UMB_USER_GROUP_REPOSITORY_ALIAS,
	name: 'User Group Repository',
	api: UmbUserGroupRepository,
};

const store: ManifestStore = {
	type: 'store',
	alias: 'Umb.Store.UserGroup',
	name: 'User Group Store',
	api: UmbUserGroupStore,
};

const itemStore: ManifestItemStore = {
	type: 'itemStore',
	alias: 'Umb.ItemStore.UserGroup',
	name: 'User Group Item Store',
	api: UmbUserGroupItemStore,
};

export const manifests = [repository, store, itemStore];
