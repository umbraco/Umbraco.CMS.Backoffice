import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import {
	UmbCollectionDataSource,
	UmbCollectionRepository,
	UmbDataSource,
	UmbDetailRepository,
} from '@umbraco-cms/backoffice/repository';
import {
	CreateUserRequestModel,
	CreateUserResponseModel,
	UpdateUserRequestModel,
	UserResponseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UMB_NOTIFICATION_CONTEXT_TOKEN, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
import { UMB_USER_STORE_CONTEXT_TOKEN, UmbUserStore } from './user.store';
import { UmbUserServerDataSource } from './sources/user.server.data';
import { UmbUserCollectionServerDataSource } from './sources/user-collection.server.data';

export type UmbUserDetailDataSource = UmbDataSource<
	CreateUserRequestModel,
	CreateUserResponseModel,
	UpdateUserRequestModel,
	UserResponseModel
>;

// TODO: implement
export class UmbUserRepository
	implements
		UmbDetailRepository<CreateUserRequestModel, UpdateUserRequestModel, UserResponseModel>,
		UmbCollectionRepository
{
	#host: UmbControllerHostElement;

	#detailSource: UmbUserDetailDataSource;
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

	createScaffold(parentId: string | null) {
		if (parentId === undefined) throw new Error('Parent id is missing');
		return this.#detailSource.createScaffold(parentId);
	}

	async requestById(id: string) {
		if (!id) throw new Error('Id is missing');

		const { data, error } = await this.#detailSource.get(id);

		if (data) {
			this.#detailStore?.append(data);
		}

		return { data, error };
	}

	async create(userRequestData: CreateUserRequestModel) {
		if (!userRequestData) throw new Error('Data is missing');

		const { data: createdData, error } = await this.#detailSource.insert(userRequestData);

		if (createdData && createdData.userId) {
			const { data: user } = await this.#detailSource.get(createdData?.userId);

			if (user) {
				this.#detailStore?.append(user);
			}

			const notification = { data: { message: `User created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { data: createdData, error };
	}

	async save(id: string, user: UpdateUserRequestModel) {
		if (!id) throw new Error('User id is missing');
		if (!user) throw new Error('User update data is missing');

		const { data, error } = await this.#detailSource.update(id, user);

		if (data) {
			this.#detailStore?.append(data);

			const notification = { data: { message: `User saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { data, error };
	}

	async delete(id: string) {
		if (!id) throw new Error('Id is missing');

		const { error } = await this.#detailSource.delete(id);

		if (!error) {
			this.#detailStore?.remove([id]);

			const notification = { data: { message: `User deleted` } };
			this.#notificationContext?.peek('positive', notification);
		}

		return { error };
	}
}
