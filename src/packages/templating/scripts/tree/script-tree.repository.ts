import { UMB_SCRIPT_ROOT_ENTITY_TYPE } from '../entity.js';
import { UmbScriptTreeServerDataSource } from './script-tree.server.data-source.js';
import type { UmbScriptTreeItemModel, UmbScriptTreeRootModel } from './types.js';
import { UMB_SCRIPT_TREE_STORE_CONTEXT } from './script-tree.store.js';
import { UmbTreeRepositoryBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

// TODO: TREE STORE TYPE PROBLEM:
export class UmbScriptTreeRepository extends UmbTreeRepositoryBase<UmbScriptTreeItemModel, UmbScriptTreeRootModel> {
	constructor(host: UmbControllerHost) {
		super(host, UmbScriptTreeServerDataSource, UMB_SCRIPT_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot() {
		const data: UmbScriptTreeRootModel = {
			unique: null,
			entityType: UMB_SCRIPT_ROOT_ENTITY_TYPE,
			name: 'Scripts',
			hasChildren: true,
			isFolder: true,
		};

		return { data };
	}
}

export default UmbScriptTreeRepository;
