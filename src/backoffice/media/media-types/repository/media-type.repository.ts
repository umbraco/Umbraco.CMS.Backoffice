import { UmbMediaTypeTreeStore, UMB_MEDIA_TYPE_TREE_STORE_CONTEXT_TOKEN } from "./media-type.tree.store";
import { UmbMediaTypeDetailServerDataSource } from "./sources/media-type.detail.server.data";
import { UmbMediaTypeDetailStore, UMB_MEDIA_TYPE_DETAIL_STORE_CONTEXT_TOKEN } from "./media-type.detail.store";
import { MediaTypeTreeServerDataSource } from "./sources/media-type.tree.server.data";
import { ProblemDetailsModel } from "@umbraco-cms/backend-api";
import { UmbContextConsumerController } from "@umbraco-cms/context-api";
import { UmbControllerHostInterface } from "@umbraco-cms/controller";
import type { MediaTypeDetails } from "@umbraco-cms/models";
import { UmbNotificationService, UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN } from "@umbraco-cms/notification";
import { UmbTreeRepository, RepositoryTreeDataSource } from "@umbraco-cms/repository";

export class UmbMediaTypeRepository implements UmbTreeRepository {
	#init!: Promise<unknown>;

	#host: UmbControllerHostInterface;

	#treeSource: RepositoryTreeDataSource;
	#treeStore?: UmbMediaTypeTreeStore;

	#detailSource: UmbMediaTypeDetailServerDataSource;
	#detailStore?: UmbMediaTypeDetailStore;

	#notificationService?: UmbNotificationService;

	constructor(host: UmbControllerHostInterface) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new MediaTypeTreeServerDataSource(this.#host);
		this.#detailSource = new UmbMediaTypeDetailServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_MEDIA_TYPE_DETAIL_STORE_CONTEXT_TOKEN, (instance) => {
				this.#detailStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_MEDIA_TYPE_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN, (instance) => {
				this.#notificationService = instance;
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
		await this.#init;

		if (!parentKey) {
			const error: ProblemDetailsModel = { title: 'Parent key is missing' };
			return { data: undefined, error };
		}

		const { data, error } = await this.#treeSource.getChildrenOf(parentKey);

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.childrenOf(parentKey) };
	}

	async requestTreeItems(keys: Array<string>) {
		await this.#init;

		if (!keys) {
			const error: ProblemDetailsModel = { title: 'Keys are missing' };
			return { data: undefined, error };
		}

		const { data, error } = await this.#treeSource.getItems(keys);

		return { data, error, asObservable: () => this.#treeStore!.items(keys) };
	}

	async rootTreeItems() {
		await this.#init;
		return this.#treeStore!.rootItems;
	}

	async treeItemsOf(parentKey: string | null) {
		await this.#init;
		return this.#treeStore!.childrenOf(parentKey);
	}

	async treeItems(keys: Array<string>) {
		await this.#init;
		return this.#treeStore!.items(keys);
	}

	// DETAILS

	async createDetailsScaffold() {
		await this.#init;
		return this.#detailSource.createScaffold();
	}

	async requestDetails(key: string) {
		await this.#init;

		// TODO: should we show a notification if the key is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!key) {
			const error: ProblemDetailsModel = { title: 'Key is missing' };
			return { error };
		}
		const { data, error } = await this.#detailSource.get(key);

		if (data) {
			this.#detailStore?.append(data);
		}
		return { data, error };
	}

	async delete(key: string) {
		await this.#init;
		return this.#detailSource.delete(key);
	}

	async saveDetail(mediaType: MediaTypeDetails) {
		await this.#init;

		// TODO: should we show a notification if the media type is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!mediaType || !mediaType.key) {
			const error: ProblemDetailsModel = { title: 'Media Type is missing' };
			return { error };
		}

		const { error } = await this.#detailSource.update(mediaType);

		if (!error) {
			const notification = { data: { message: `Media type '${mediaType.name}' saved` } };
			this.#notificationService?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		// Consider notify a workspace if a media type is updated in the store while someone is editing it.
		this.#detailStore?.append(mediaType);
		this.#treeStore?.updateItem(mediaType.key, { name: mediaType.name });
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	async createDetail(mediaType: MediaTypeDetails) {
		await this.#init;

		if (!mediaType.name) {
			const error: ProblemDetailsModel = { title: 'Name is missing' };
			return { error };
		}

		const { data, error } = await this.#detailSource.insert(mediaType);

		if (!error) {
			const notification = { data: { message: `Media type '${mediaType.name}' created` } };
			this.#notificationService?.peek('positive', notification);
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
