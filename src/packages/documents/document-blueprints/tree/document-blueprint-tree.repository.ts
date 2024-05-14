import { UMB_DOCUMENT_BLUEPRINT_ENTITY_TYPE } from '../entity.js';
import { UmbDocumentBlueprintTreeServerDataSource } from './document-blueprint-tree.server.data-source.js';
import { UMB_DOCUMENT_BLUEPRINT_TREE_STORE_CONTEXT } from './document-blueprint-tree.store.js';
import type { UmbDocumentBlueprintTreeItemModel, UmbDocumentBlueprintTreeRootModel } from './types.js';
import { UmbTreeRepositoryBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class UmbDocumentBlueprintTreeRepository
	extends UmbTreeRepositoryBase<UmbDocumentBlueprintTreeItemModel, UmbDocumentBlueprintTreeRootModel>
	implements UmbApi
{
	constructor(host: UmbControllerHost) {
		super(host, UmbDocumentBlueprintTreeServerDataSource, UMB_DOCUMENT_BLUEPRINT_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot() {
		const { data: treeRootData } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
		const hasChildren = treeRootData ? treeRootData.total > 0 : false;

		const data: UmbDocumentBlueprintTreeRootModel = {
			unique: null,
			entityType: UMB_DOCUMENT_BLUEPRINT_ENTITY_TYPE,
			name: 'Document Blueprints',
			hasChildren,
			isFolder: true,
		};

		return { data };
	}
}
