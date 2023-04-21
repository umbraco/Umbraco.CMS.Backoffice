import { DataSourceResponse, UmbDataSource } from '@umbraco-cms/backoffice/repository';
import {
	UserResponseModel,
	CreateUserRequestModel,
	UpdateUserRequestModel,
	UserPresentationBaseModel,
	UsersResource,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the User that fetches data from the server
 * @export
 * @class UmbUserServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbUserServerDataSource
	implements UmbDataSource<CreateUserRequestModel, UpdateUserRequestModel, UserResponseModel>
{
	//TODO: Add the entity type here
	//TODO: Add a UserModel that extends the UserResponseModel and adds the entity type and put it in the root of the users folder and export it in the index file

	#host: UmbControllerHostElement;

	/**
	 * Creates an instance of UmbUserServerDataSource.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbUserServerDataSource
	 */
	constructor(host: UmbControllerHostElement) {
		this.#host = host;
	}
	createScaffold(parentId: string | null): Promise<DataSourceResponse<UserPresentationBaseModel>> {
		throw new Error('Method not implemented.');
	}
	get(unique: string) {
		return tryExecuteAndNotify(this.#host, UsersResource.getUsersById({ id: unique }));
	}
	insert(data: UserPresentationBaseModel): Promise<any> {
		throw new Error('Method not implemented.');
	}
	update(unique: string, data: UpdateUserRequestModel): Promise<DataSourceResponse<UserResponseModel>> {
		if (!unique) throw new Error('Key is missing');

		return tryExecuteAndNotify(
			this.#host,
			UsersResource.putUsersById({
				id: unique,
				requestBody: data,
			})
		);
	}
	delete(unique: string): Promise<DataSourceResponse<undefined>> {
		throw new Error('Method not implemented.');
	}
}
