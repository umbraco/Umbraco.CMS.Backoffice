import { UmbMemberTreeStore, UMB_MEMBER_TREE_STORE_CONTEXT_TOKEN } from './member.tree.store';
import { UmbMemberTreeServerDataSource } from './sources/member.tree.server.data';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbTreeRepository } from '@umbraco-cms/backoffice/repository';
import { ProblemDetailsModel } from '@umbraco-cms/backoffice/backend-api';

export class UmbMemberRepository implements UmbTreeRepository {
	#host: UmbControllerHostElement;
	#dataSource: UmbMemberTreeServerDataSource;
	#treeStore?: UmbMemberTreeStore;
	#notificationContext?: UmbNotificationContext;
	#initResolver?: () => void;
	#initialized = false;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;
		// TODO: figure out how spin up get the correct data source
		this.#dataSource = new UmbMemberTreeServerDataSource(this.#host);

		new UmbContextConsumerController(this.#host, UMB_MEMBER_TREE_STORE_CONTEXT_TOKEN, (instance) => {
			this.#treeStore = instance;
			this.#checkIfInitialized();
		});

		new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
			this.#notificationContext = instance;
			this.#checkIfInitialized();
		});
	}

	#init = new Promise<void>((resolve) => {
		this.#initialized ? resolve() : (this.#initResolver = resolve);
	});

	#checkIfInitialized() {
		if (this.#treeStore && this.#notificationContext) {
			this.#initialized = true;
			this.#initResolver?.();
		}
	}

	async requestRootTreeItems() {
		await this.#init;

		const { data, error } = await this.#dataSource.getRootItems();

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error };
	}

	async requestTreeItemsOf(parentId: string | null) {
		const error: ProblemDetailsModel = { title: 'Not implemented' };
		return { data: undefined, error };
	}

	async requestTreeItems(ids: Array<string>) {
		await this.#init;

		if (!ids) {
			const error: ProblemDetailsModel = { title: 'Keys are missing' };
			return { data: undefined, error };
		}

		const { data, error } = await this.#dataSource.getItems(ids);

		return { data, error };
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
}
