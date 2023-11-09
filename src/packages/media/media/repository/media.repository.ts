import type { MediaDetails } from '../index.js';
import { UmbMediaTreeServerDataSource } from './sources/media.tree.server.data.js';
import { UmbMediaTreeStore, UMB_MEDIA_TREE_STORE_CONTEXT_TOKEN } from './media.tree.store.js';
import { UmbMediaStore, UMB_MEDIA_STORE_CONTEXT_TOKEN } from './media.store.js';
import { UmbMediaDetailServerDataSource } from './sources/media.detail.server.data.js';
import { UmbMediaItemServerDataSource } from './sources/media-item.server.data.js';
import { UmbMediaItemStore } from './media-item.store.js';
import type { UmbTreeRepository, UmbTreeDataSource } from '@umbraco-cms/backoffice/repository';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import {
	CreateMediaRequestModel,
	EntityTreeItemResponseModel,
	UpdateMediaRequestModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbDetailRepository } from '@umbraco-cms/backoffice/repository';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';

export class UmbMediaRepository
	implements
		UmbTreeRepository<EntityTreeItemResponseModel>,
		UmbDetailRepository<CreateMediaRequestModel, any, UpdateMediaRequestModel, MediaDetails>
{
	#host: UmbControllerHostElement;
	#init;

	#treeSource: UmbTreeDataSource;
	#treeStore?: UmbMediaTreeStore;

	#detailDataSource: UmbMediaDetailServerDataSource;
	#store?: UmbMediaStore;

	#itemSource: UmbMediaItemServerDataSource;
	#itemStore?: UmbMediaItemStore;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new UmbMediaTreeServerDataSource(this.#host);
		this.#detailDataSource = new UmbMediaDetailServerDataSource(this.#host);
		this.#itemSource = new UmbMediaItemServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_MEDIA_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_MEDIA_STORE_CONTEXT_TOKEN, (instance) => {
				this.#store = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_MEDIA_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#itemStore = instance;
			}).asPromise(),

			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
				this.#notificationContext = instance;
			}).asPromise(),
		]);
	}

	// TREE:
	async requestTreeRoot() {
		await this.#init;

		const data = {
			id: null,
			type: 'media-root',
			name: 'Media',
			icon: 'icon-folder',
			hasChildren: true,
		};

		return { data };
	}

	async requestRootTreeItems() {
		await this.#init;

		const { data, error } = await this.#treeSource.getRootItems();

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.rootItems };
	}

	async requestTreeItemsOf(parentId: string | null) {
		await this.#init;
		if (parentId === undefined) throw new Error('Parent id is missing');

		const { data, error } = await this.#treeSource.getChildrenOf(parentId);

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.childrenOf(parentId) };
	}

	async requestItemsLegacy(ids: Array<string>) {
		await this.#init;

		if (!ids) {
			throw new Error('Ids are missing');
		}

		const { data, error } = await this.#treeSource.getItems(ids);

		return { data, error, asObservable: () => this.#treeStore!.items(ids) };
	}

	async rootTreeItems() {
		await this.#init;
		return this.#treeStore!.rootItems;
	}

	async treeItemsOf(parentId: string | null) {
		await this.#init;
		return this.#treeStore!.childrenOf(parentId);
	}

	async itemsLegacy(ids: Array<string>) {
		await this.#init;
		return this.#treeStore!.items(ids);
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
		return this.#detailDataSource.createScaffold(parentId);
	}

	async requestById(id: string) {
		if (!id) throw new Error('Id is missing');
		await this.#init;

		const { data, error } = await this.#detailDataSource.get(id);

		if (data) {
			this.#store?.append(data);
		}

		return { data, error };
	}

	async byId(id: string) {
		if (!id) throw new Error('Id is missing');
		await this.#init;
		return this.#store!.byId(id);
	}

	// Could potentially be general methods:

	async create(media: CreateMediaRequestModel) {
		if (!media) throw new Error('Media is missing');

		await this.#init;

		const { error } = await this.#detailDataSource.insert(media);

		if (!error) {
			// TODO: we currently don't use the detail store for anything.
			// Consider to look up the data before fetching from the server
			// TODO: Update tree store with the new item? or ask tree to request the new item?
			//this.#store?.append(media);

			const notification = { data: { message: `Media created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	async save(id: string, updatedItem: UpdateMediaRequestModel) {
		if (!id) throw new Error('Id is missing');
		if (!updatedItem) throw new Error('Updated media item is missing');

		await this.#init;

		const { error } = await this.#detailDataSource.update(id, updatedItem);

		if (!error) {
			// TODO: we currently don't use the detail store for anything.
			// Consider to look up the data before fetching from the server
			// Consider notify a workspace if a template is updated in the store while someone is editing it.
			// TODO: would be nice to align the stores on methods/methodNames.
			// this.#store?.append(updatedMediaItem);
			// this.#treeStore?.updateItem(id, updatedItem);

			const notification = { data: { message: `Media saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}

	// General:
	async delete(id: string) {
		await this.#init;

		if (!id) {
			throw new Error('Document id is missing');
		}

		const { error } = await this.#detailDataSource.delete(id);

		if (!error) {
			const notification = { data: { message: `Document deleted` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server.
		// Consider notify a workspace if a template is deleted from the store while someone is editing it.
		this.#store?.remove([id]);
		this.#treeStore?.removeItem(id);
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	async trash(ids: Array<string>) {
		console.log('media trash: ' + ids);
		alert('implement trash');
	}

	async move(ids: Array<string>, destination: string | null) {
		// TODO: use backend cli when available.
		const res = await fetch('/umbraco/management/api/v1/media/move', {
			method: 'POST',
			body: JSON.stringify({ ids, destination }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		this.#treeStore?.appendItems(data);
	}

	async copy(uniques: Array<string>, destination: string) {
		console.log(`copy: ${uniques} to ${destination}`);
		alert('copy');
	}

	async sortChildrenOf() {
		alert('sort');
	}
}
