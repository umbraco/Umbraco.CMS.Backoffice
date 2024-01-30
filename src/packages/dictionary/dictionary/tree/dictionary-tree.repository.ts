import { UMB_DICTIONARY_ROOT_ENTITY_TYPE } from '../entity.js';
import { UmbDictionaryTreeServerDataSource } from './dictionary-tree.server.data-source.js';
import type { UmbDictionaryTreeItemModel, UmbDictionaryTreeRootModel } from './types.js';
import { UMB_DICTIONARY_TREE_STORE_CONTEXT } from './dictionary-tree.store.js';
import { UmbTreeRepositoryBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class UmbDictionaryTreeRepository
	extends UmbTreeRepositoryBase<UmbDictionaryTreeItemModel, UmbDictionaryTreeRootModel>
	implements UmbApi
{
	constructor(host: UmbControllerHost) {
		super(host, UmbDictionaryTreeServerDataSource, UMB_DICTIONARY_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot() {
		const data = {
			id: null,
			entityType: UMB_DICTIONARY_ROOT_ENTITY_TYPE,
			name: 'Dictionary',
			icon: 'icon-folder',
			hasChildren: true,
			isContainer: false,
			isFolder: true,
		};

		return { data };
	}
}
