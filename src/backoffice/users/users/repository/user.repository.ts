import { UMB_USER_STORE_CONTEXT_TOKEN, UmbUserStore } from './user.store';
import { UmbUserServerDataSource } from './sources/user.server.data';
import { UmbUserCollectionServerDataSource } from './sources/user-collection.server.data';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import {
	UmbCollectionDataSource,
	UmbCollectionRepository,
	UmbDataSource,
	UmbDetailRepository,
	UmbRepositoryErrorResponse,
	UmbRepositoryResponse,
} from '@umbraco-cms/backoffice/repository';
import {
	CreateUserRequestModel,
	UpdateUserRequestModel,
	UserPresentationBaseModel,
	UserResponseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UMB_NOTIFICATION_CONTEXT_TOKEN, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';

// TODO: implement
export class UmbUserRepository
	implements
		UmbDetailRepository<CreateUserRequestModel, UpdateUserRequestModel, UserResponseModel>,
		UmbCollectionRepository
{
	#host: UmbControllerHostElement;

	#detailSource: UmbDataSource<CreateUserRequestModel, UpdateUserRequestModel, UserResponseModel>;
	#detailStore?: UmbUserStore;
	#collectionSource: UmbCollectionDataSource<UserResponseModel>;
	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		this.#detailSource = new UmbUserServerDataSource(this.#host);

		this.#collectionSource = new UmbUserCollectionServerDataSource(this.#host);

		new UmbContextConsumerController(this.#host, UMB_USER_STORE_CONTEXT_TOKEN, (instance) => {
			this.#detailStore = instance;
		});

		new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
			this.#notificationContext = instance;
		});
	}

	async requestCollection() {
		//TODO: missing observable
		return this.#collectionSource.getCollection();
	}

	createScaffold(parentId: string | null): Promise<UmbRepositoryResponse<UserPresentationBaseModel>> {
		throw new Error('Method not implemented.');
	}
	async requestById(id: string) {
		return this.#detailSource.get(id);
	}
	create(data: UserPresentationBaseModel): Promise<UmbRepositoryErrorResponse> {
		throw new Error('Method not implemented.');
	}
	async save(id: string, user: UpdateUserRequestModel): Promise<UmbRepositoryErrorResponse> {
		if (!id) throw new Error('User id is missing');
		if (!user) throw new Error('User is missing');

		const { data, error } = await this.#detailSource.update(id, user);

		if (!error && data) {
			this.#detailStore?.append(data);

			const notification = { data: { message: `User saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}
	delete(id: string): Promise<UmbRepositoryErrorResponse> {
		throw new Error('Method not implemented.');
	}
}
