import { DataSourceResponse } from './data-source-response.interface';
import { CreateFolderRequestModel, FolderReponseModel } from '@umbraco-cms/backoffice/backend-api';

export interface UmbFolderDataSource<
	RequestType extends CreateFolderRequestModel,
	ResponseType extends FolderReponseModel
> {
	createScaffold(parentKey: string | null): Promise<ResponseType>;
	get(unique: string): Promise<DataSourceResponse<ResponseType>>;
	insert(data: RequestType): Promise<DataSourceResponse<string>>;
	//update(data: T): Promise<DataSourceResponse<T>>;
	delete(unique: string): Promise<DataSourceResponse>;
}
