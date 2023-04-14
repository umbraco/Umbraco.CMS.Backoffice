import { UMB_USER_STORE_CONTEXT_TOKEN, UmbUserStore } from './user.store';
import { UmbUserServerDataSource } from './sources/user.server.data';
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
import { UmbUserCollectionServerDataSource } from './sources/user-collection.server.data';

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

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		this.#detailSource = new UmbUserServerDataSource(this.#host);

		this.#collectionSource = new UmbUserCollectionServerDataSource(this.#host);

		new UmbContextConsumerController(this.#host, UMB_USER_STORE_CONTEXT_TOKEN, (instance) => {
			this.#detailStore = instance;
		});
	}

	async requestCollection() {
		//TODO: missing observable
		return this.#collectionSource.getCollection();
	}

	createScaffold(parentId: string | null): Promise<UmbRepositoryResponse<UserPresentationBaseModel>> {
		throw new Error('Method not implemented.');
	}
	requestById(id: string): Promise<UmbRepositoryResponse<UserResponseModel>> {
		console.log('requestById', id);

		throw new Error('Method not implemented.');
	}
	create(data: UserPresentationBaseModel): Promise<UmbRepositoryErrorResponse> {
		throw new Error('Method not implemented.');
	}
	save(id: string, data: UpdateUserRequestModel): Promise<UmbRepositoryErrorResponse> {
		throw new Error('Method not implemented.');
	}
	delete(id: string): Promise<UmbRepositoryErrorResponse> {
		throw new Error('Method not implemented.');
	}
}
