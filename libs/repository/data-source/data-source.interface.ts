import type { DataSourceResponse } from '@umbraco-cms/backoffice/repository';

export interface UmbDataSource<CreateRequestType, UpdateRequestType, ResponseType> {
	createScaffold(parentKey: string | null): Promise<DataSourceResponse<ResponseType>>;
	get(unique: string): Promise<DataSourceResponse<ResponseType>>;
	insert(data: CreateRequestType): Promise<any>;
	update(unique: string, data: UpdateRequestType): Promise<DataSourceResponse<ResponseType>>;
	delete(unique: string): Promise<DataSourceResponse>;
}
