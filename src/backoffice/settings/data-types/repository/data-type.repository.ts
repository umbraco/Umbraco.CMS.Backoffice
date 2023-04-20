import { UmbDataTypeTreeServerDataSource } from './sources/data-type.tree.server.data';
import { UmbDataTypeMoveServerDataSource } from './sources/data-type-move.server.data';
import { UmbDataTypeStore, UMB_DATA_TYPE_STORE_CONTEXT_TOKEN } from './data-type.store';
import { UmbDataTypeServerDataSource } from './sources/data-type.server.data';
import { UmbDataTypeTreeStore, UMB_DATA_TYPE_TREE_STORE_CONTEXT_TOKEN } from './data-type.tree.store';
import { UmbDataTypeFolderServerDataSource } from './sources/data-type-folder.server.data';
import { UmbDataTypeItemServerDataSource } from './sources/data-type-item.server.data';
import { UMB_DATA_TYPE_ITEM_STORE_CONTEXT_TOKEN, UmbDataTypeItemStore } from './data-type-item.store';
import { UmbDataTypeCopyServerDataSource } from './sources/data-type-copy.server.data';
import type {
	UmbTreeRepository,
	UmbDetailRepository,
	UmbItemRepository,
	UmbFolderRepository,
	UmbMoveRepository,
	UmbCopyRepository,
} from '@umbraco-cms/backoffice/repository';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import {
	CreateDataTypeRequestModel,
	CreateFolderRequestModel,
	DataTypeItemResponseModel,
	DataTypeResponseModel,
	FolderModelBaseModel,
	FolderTreeItemResponseModel,
	UpdateDataTypeRequestModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
export class UmbDataTypeRepository
	implements
		UmbItemRepository<DataTypeItemResponseModel>,
		UmbTreeRepository<FolderTreeItemResponseModel>,
		UmbDetailRepository<CreateDataTypeRequestModel, UpdateDataTypeRequestModel, DataTypeResponseModel>,
		UmbFolderRepository,
		UmbMoveRepository,
		UmbCopyRepository
{
	#init: Promise<unknown>;

	#host: UmbControllerHostElement;

	#treeSource: UmbDataTypeTreeServerDataSource;
	#detailSource: UmbDataTypeServerDataSource;
	#folderSource: UmbDataTypeFolderServerDataSource;
	#itemSource: UmbDataTypeItemServerDataSource;
	#moveSource: UmbDataTypeMoveServerDataSource;
	#copySource: UmbDataTypeCopyServerDataSource;

	#detailStore?: UmbDataTypeStore;
	#treeStore?: UmbDataTypeTreeStore;
	#itemStore?: UmbDataTypeItemStore;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new UmbDataTypeTreeServerDataSource(this.#host);
		this.#detailSource = new UmbDataTypeServerDataSource(this.#host);
		this.#folderSource = new UmbDataTypeFolderServerDataSource(this.#host);
		this.#itemSource = new UmbDataTypeItemServerDataSource(this.#host);
		this.#moveSource = new UmbDataTypeMoveServerDataSource(this.#host);
		this.#copySource = new UmbDataTypeCopyServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_DATA_TYPE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#detailStore = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_DATA_TYPE_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_DATA_TYPE_ITEM_STORE_CONTEXT_TOKEN, (instance) => {
				this.#itemStore = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
				this.#notificationContext = instance;
			}).asPromise(),
		]);
	}

	// TREE:
	async requestRootTreeItems() {
		await this.#init;

		const { data, error } = await this.#treeSource.getRootItems();

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.rootItems };
	}

	async requestTreeItemsOf(parentId: string | null) {
		if (!parentId) throw new Error('Parent id is missing');
		await this.#init;

		const { data, error } = await this.#treeSource.getChildrenOf(parentId);

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.childrenOf(parentId) };
	}

	async rootTreeItems() {
		await this.#init;
		return this.#treeStore!.rootItems;
	}

	async treeItemsOf(parentId: string | null) {
		if (parentId === undefined) throw new Error('Parent id is missing');
		await this.#init;
		return this.#treeStore!.childrenOf(parentId);
	}

	// ITEMS:
	async requestItems(ids: Array<string>) {
		if (!ids) throw new Error('Keys are missing');
		await this.#init;

		const { data, error } = await this.#itemSource.getItems(ids);

		if (data) {
			this.#itemStore?.appendItems(data);
		}

		return { data, error, asObservable: () => this.#itemStore!.items(ids) };
	}

	async items(ids: Array<string>) {
		await this.#init;
		return this.#itemStore!.items(ids);
	}

	// DETAILS:
	async createScaffold(parentId: string | null) {
		if (parentId === undefined) throw new Error('Parent id is missing');
		await this.#init;

		return this.#detailSource.createScaffold(parentId);
	}

	async requestById(id: string) {
		if (!id) throw new Error('Key is missing');
		await this.#init;

		const { data, error } = await this.#detailSource.get(id);

		if (data) {
			this.#detailStore?.append(data);
		}

		return { data, error };
	}

	async byId(id: string) {
		if (!id) throw new Error('Key is missing');
		await this.#init;
		return this.#detailStore!.byId(id);
	}

	async create(dataType: CreateDataTypeRequestModel) {
		if (!dataType) throw new Error('Data Type is missing');
		if (!dataType.id) throw new Error('Data Type id is missing');
		await this.#init;

		const { error } = await this.#detailSource.insert(dataType);

		if (!error) {
			// TODO: We need to push a new item to the tree store to update the tree. How do we want to create the tree items?
			const treeItem = createTreeItem(dataType);
			this.#treeStore?.appendItems([treeItem]);
			//this.#detailStore?.append(dataType);

			const notification = { data: { message: `Data Type created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	async save(id: string, updatedDataType: UpdateDataTypeRequestModel) {
		if (!id) throw new Error('Data Type id is missing');
		if (!updatedDataType) throw new Error('Data Type is missing');
		await this.#init;

		const { error } = await this.#detailSource.update(id, updatedDataType);

		if (!error) {
			// TODO: we currently don't use the detail store for anything.
			// Consider to look up the data before fetching from the server
			// Consider notify a workspace if a template is updated in the store while someone is editing it.
			// TODO: would be nice to align the stores on methods/methodNames.
			// this.#detailStore?.append(dataType);
			this.#treeStore?.updateItem(id, updatedDataType);

			const notification = { data: { message: `Data Type saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	async delete(id: string) {
		if (!id) throw new Error('Data Type id is missing');
		await this.#init;

		const { error } = await this.#detailSource.delete(id);

		if (!error) {
			// TODO: we currently don't use the detail store for anything.
			// Consider to look up the data before fetching from the server.
			// Consider notify a workspace if a template is deleted from the store while someone is editing it.
			// TODO: would be nice to align the stores on methods/methodNames.
			this.#detailStore?.remove([id]);
			this.#treeStore?.removeItem(id);

			const notification = { data: { message: `Data Type deleted` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	// Folder:
	async createFolderScaffold(parentId: string | null) {
		if (parentId === undefined) throw new Error('Parent id is missing');
		await this.#init;
		return this.#folderSource.createScaffold(parentId);
	}

	// TODO: temp create type until backend is ready. Remove the id addition when new types are generated.
	async createFolder(folderRequest: CreateFolderRequestModel & { id?: string | undefined }) {
		if (!folderRequest) throw new Error('folder request is missing');
		await this.#init;

		const { error } = await this.#folderSource.insert(folderRequest);

		if (!error) {
			// TODO: We need to push a new item to the tree store to update the tree. How do we want to create the tree items?
			const folderTreeItem = createFolderTreeItem(folderRequest);
			this.#treeStore?.appendItems([folderTreeItem]);
		}

		return { error };
	}

	async deleteFolder(id: string) {
		if (!id) throw new Error('Key is missing');
		await this.#init;

		const { error } = await this.#folderSource.delete(id);

		if (!error) {
			this.#treeStore?.removeItem(id);
		}

		return { error };
	}

	async updateFolder(id: string, folder: FolderModelBaseModel) {
		if (!id) throw new Error('Key is missing');
		if (!folder) throw new Error('Folder data is missing');
		await this.#init;

		const { error } = await this.#folderSource.update(id, folder);

		if (!error) {
			this.#treeStore?.updateItem(id, { name: folder.name });
		}

		return { error };
	}

	async requestFolder(id: string) {
		if (!id) throw new Error('Key is missing');
		await this.#init;

		const { data, error } = await this.#folderSource.get(id);

		if (data) {
			this.#treeStore?.appendItems([data]);
		}

		return { data, error };
	}

	// Actions
	async move(id: string, targetId: string) {
		await this.#init;
		const { error } = await this.#moveSource.move(id, targetId);

		if (!error) {
			// TODO: Be aware about this responsibility.
			this.#treeStore?.updateItem(id, { parentId: targetId });
			this.#treeStore?.updateItem(targetId, { hasChildren: true });

			const notification = { data: { message: `Data type moved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	async copy(id: string, targetId: string) {
		await this.#init;
		const { data: dataTypeCopyId, error } = await this.#copySource.copy(id, targetId);
		if (error) return { error };

		if (dataTypeCopyId) {
			const { data: dataTypeCopy } = await this.requestById(dataTypeCopyId);
			if (!dataTypeCopy) throw new Error('Could not find copied data type');
			this.#treeStore?.appendItems([dataTypeCopy]);
			this.#treeStore?.updateItem(targetId, { hasChildren: true });

			const notification = { data: { message: `Data type copied` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { data: dataTypeCopyId };
	}
}

export const createTreeItem = (item: CreateDataTypeRequestModel): FolderTreeItemResponseModel => {
	if (!item) throw new Error('item is null or undefined');
	if (!item.id) throw new Error('item.id is null or undefined');

	return {
		$type: 'FolderTreeItemResponseModel',
		type: 'data-type',
		parentId: item.parentId,
		name: item.name,
		id: item.id,
		isFolder: false,
		isContainer: false,
		hasChildren: false,
	};
};

export const createFolderTreeItem = (item: CreateFolderRequestModel): FolderTreeItemResponseModel => {
	if (!item) throw new Error('item is null or undefined');
	if (!item.id) throw new Error('item.id is null or undefined');

	return {
		...createTreeItem(item),
		isFolder: true,
	};
};
