import { UmbMediaTypeTreeStore, UMB_MEDIA_TYPE_TREE_STORE_CONTEXT_TOKEN } from './media-type.tree.store';
import { UmbMediaTypeDetailServerDataSource } from './sources/media-type.detail.server.data';
import { UmbMediaTypeStore, UMB_MEDIA_TYPE_STORE_CONTEXT_TOKEN } from './media-type.detail.store';
import { UmbMediaTypeTreeServerDataSource } from './sources/media-type.tree.server.data';
import { ProblemDetailsModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import type { MediaTypeDetails } from '@umbraco-cms/backoffice/models';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
import { UmbTreeRepository, UmbTreeDataSource } from '@umbraco-cms/backoffice/repository';

export class UmbMediaTypeRepository implements UmbTreeRepository {
	#init!: Promise<unknown>;

	#host: UmbControllerHostElement;

	#treeSource: UmbTreeDataSource;
	#treeStore?: UmbMediaTypeTreeStore;

	#detailSource: UmbMediaTypeDetailServerDataSource;
	#store?: UmbMediaTypeStore;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new UmbMediaTypeTreeServerDataSource(this.#host);
		this.#detailSource = new UmbMediaTypeDetailServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_MEDIA_TYPE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#store = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_MEDIA_TYPE_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
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

	async requestTreeItemsOf(parentId: string | null) {
		await this.#init;

		if (!parentId) {
			const error: ProblemDetailsModel = { title: 'Parent id is missing' };
			return { data: undefined, error };
		}

		const { data, error } = await this.#treeSource.getChildrenOf(parentId);

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.childrenOf(parentId) };
	}

	async requestTreeItems(ids: Array<string>) {
		await this.#init;

		if (!ids) {
			const error: ProblemDetailsModel = { title: 'Keys are missing' };
			return { data: undefined, error };
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

	async treeItems(ids: Array<string>) {
		await this.#init;
		return this.#treeStore!.items(ids);
	}

	// DETAILS

	async createScaffold() {
		await this.#init;
		return this.#detailSource.createScaffold();
	}

	async requestDetails(id: string) {
		await this.#init;

		// TODO: should we show a notification if the id is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!id) {
			const error: ProblemDetailsModel = { title: 'Id is missing' };
			return { error };
		}
		const { data, error } = await this.#detailSource.get(id);

		if (data) {
			this.#store?.append(data);
		}
		return { data, error };
	}

	async delete(id: string) {
		await this.#init;
		return this.#detailSource.delete(id);
	}

	async save(mediaType: MediaTypeDetails) {
		await this.#init;

		// TODO: should we show a notification if the media type is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!mediaType || !mediaType.id) {
			const error: ProblemDetailsModel = { title: 'Media Type is missing' };
			return { error };
		}

		const { error } = await this.#detailSource.update(mediaType);

		if (!error) {
			const notification = { data: { message: `Media type '${mediaType.name}' saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		// Consider notify a workspace if a media type is updated in the store while someone is editing it.
		this.#store?.append(mediaType);
		this.#treeStore?.updateItem(mediaType.id, { name: mediaType.name });
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	async create(mediaType: MediaTypeDetails) {
		await this.#init;

		if (!mediaType.name) {
			const error: ProblemDetailsModel = { title: 'Name is missing' };
			return { error };
		}

		const { data, error } = await this.#detailSource.insert(mediaType);

		if (!error) {
			const notification = { data: { message: `Media type '${mediaType.name}' created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { data, error };
	}

	async move() {
		alert('move me!');
	}

	async copy() {
		alert('copy me');
	}
}
