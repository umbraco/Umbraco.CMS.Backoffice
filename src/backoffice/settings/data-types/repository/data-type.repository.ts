import { UmbDataTypeTreeServerDataSource } from './sources/data-type.tree.server.data';
import { UmbDataTypeStore, UMB_DATA_TYPE_STORE_CONTEXT_TOKEN } from './data-type.store';
import { UmbDataTypeServerDataSource } from './sources/data-type.server.data';
import { UmbDataTypeTreeStore, UMB_DATA_TYPE_TREE_STORE_CONTEXT_TOKEN } from './data-type.tree.store';
import { UmbDataTypeFolderServerDataSource } from './sources/data-type-folder.server.data';
import type {
	UmbTreeDataSource,
	UmbTreeRepository,
	UmbDetailRepository,
	UmbFolderDataSource,
	UmbDataSource,
} from '@umbraco-cms/backoffice/repository';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import {
	CreateFolderRequestModel,
	DataTypeResponseModel,
	FolderReponseModel,
	FolderTreeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
import { UmbFolderRepository } from 'libs/repository/folder-repository.interface';

type ItemType = DataTypeResponseModel;
type TreeItemType = any;

export class UmbDataTypeRepository
	implements UmbTreeRepository<TreeItemType>, UmbDetailRepository<ItemType>, UmbFolderRepository
{
	#init!: Promise<unknown>;

	#host: UmbControllerHostElement;

	#treeSource: UmbTreeDataSource;
	#detailSource: UmbDataSource<DataTypeResponseModel>;
	#folderSource: UmbFolderDataSource<CreateFolderRequestModel, FolderReponseModel>;

	#detailStore?: UmbDataTypeStore;
	#treeStore?: UmbDataTypeTreeStore;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new UmbDataTypeTreeServerDataSource(this.#host);
		this.#detailSource = new UmbDataTypeServerDataSource(this.#host);
		this.#folderSource = new UmbDataTypeFolderServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_DATA_TYPE_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_DATA_TYPE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#detailStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
				this.#notificationContext = instance;
			}),
		]);
	}

	async requestRootTreeItems() {
		await this.#init;

		const { data, error } = await this.#treeSource.getRootItems();

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.rootItems };
	}

	async requestTreeItemsOf(parentKey: string | null) {
		if (!parentKey) throw new Error('Parent key is missing');
		await this.#init;

		const { data, error } = await this.#treeSource.getChildrenOf(parentKey);

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.childrenOf(parentKey) };
	}

	async requestTreeItems(keys: Array<string>) {
		if (!keys) throw new Error('Keys are missing');
		await this.#init;

		const { data, error } = await this.#treeSource.getItems(keys);

		return { data, error, asObservable: () => this.#treeStore!.items(keys) };
	}

	async rootTreeItems() {
		await this.#init;
		return this.#treeStore!.rootItems;
	}

	async treeItemsOf(parentKey: string | null) {
		if (parentKey === undefined) throw new Error('Parent key is missing');
		await this.#init;
		return this.#treeStore!.childrenOf(parentKey);
	}

	async treeItems(keys: Array<string>) {
		await this.#init;
		return this.#treeStore!.items(keys);
	}

	// DETAILS:

	async createScaffold(parentKey: string | null) {
		if (parentKey === undefined) throw new Error('Parent key is missing');
		await this.#init;

		return this.#detailSource.createScaffold(parentKey);
	}

	async requestByKey(key: string) {
		if (!key) throw new Error('Key is missing');
		await this.#init;

		const { data, error } = await this.#detailSource.get(key);

		if (data) {
			this.#detailStore?.append(data);
		}

		return { data, error };
	}

	async byKey(key: string) {
		if (!key) throw new Error('Key is missing');
		await this.#init;
		return this.#detailStore!.byKey(key);
	}

	// Could potentially be general methods:

	async create(template: ItemType) {
		if (!template || !template.key) {
			throw new Error('Template is missing');
		}

		await this.#init;

		const { error } = await this.#detailSource.insert(template);

		if (!error) {
			const notification = { data: { message: `Document created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		this.#detailStore?.append(template);
		// TODO: Update tree store with the new item? or ask tree to request the new item?

		return { error };
	}

	async save(item: ItemType) {
		if (!item || !item.key) {
			throw new Error('Data Type is missing');
		}

		await this.#init;

		const { error } = await this.#detailSource.update(item);

		if (!error) {
			const notification = { data: { message: `Document saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		// Consider notify a workspace if a template is updated in the store while someone is editing it.
		this.#detailStore?.append(item);
		this.#treeStore?.updateItem(item.key, { name: item.name });
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	// General:

	async delete(key: string) {
		if (!key) throw new Error('Data Type key is missing');
		await this.#init;

		const { error } = await this.#detailSource.delete(key);

		if (!error) {
			const notification = { data: { message: `Data Type deleted` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server.
		// Consider notify a workspace if a template is deleted from the store while someone is editing it.
		this.#detailStore?.remove([key]);
		this.#treeStore?.removeItem(key);
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	// folder
	async createFolderScaffold(parentKey: string | null) {
		if (parentKey === undefined) throw new Error('Parent key is missing');
		return this.#folderSource.createScaffold(parentKey);
	}

	// TODO: temp create type until backend is ready. Remove the key addition when new types are generated.
	async createFolder(folderRequest: CreateFolderRequestModel & { key?: string | undefined }) {
		if (!folderRequest) throw new Error('folder request is missing');
		await this.#init;

		const { error } = await this.#folderSource.insert(folderRequest);

		// TODO: We need to push a new item to the tree store to update the tree. How do we want to create the tree items?
		if (!error) {
			const treeItem: FolderTreeItemResponseModel = {
				$type: 'FolderTreeItemResponseModel',
				parentKey: folderRequest.parentKey,
				name: folderRequest.name,
				key: folderRequest.key,
				isFolder: true,
				isContainer: false,
				type: 'data-type',
				icon: 'umb:folder',
				hasChildren: false,
			};

			this.#treeStore?.appendItems([treeItem]);
		}

		return { error };
	}

	async deleteFolder(key: string) {
		if (!key) throw new Error('Key is missing');

		const { error } = await this.#folderSource.delete(key);

		if (!error) {
			this.#treeStore?.removeItem(key);
		}

		return { error };
	}

	async renameFolder(key: string) {
		if (!key) throw new Error('Key is missing');

		const { error } = await this.#folderSource.delete(key);

		if (!error) {
			this.#treeStore?.removeItem(key);
		}

		return { error };
	}
}
