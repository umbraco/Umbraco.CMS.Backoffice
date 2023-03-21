import {
	DictionaryItemResponseModel,
	UploadDictionaryResponseModel,
	PagedDictionaryOverviewResponseModel,
	PagedLanguageResponseModel,
} from '@umbraco-cms/backoffice/backend-api';
import type { DataSourceResponse, DictionaryDetails } from '@umbraco-cms/backoffice/models';

export interface DictionaryDetailDataSource {
	createScaffold(parentKey: string): Promise<DataSourceResponse<DictionaryItemResponseModel>>;
	list(skip?: number, take?: number): Promise<DataSourceResponse<PagedDictionaryOverviewResponseModel>>;
	get(key: string): Promise<DataSourceResponse<DictionaryItemResponseModel>>;
	insert(data: DictionaryDetails): Promise<DataSourceResponse>;
	update(dictionary: DictionaryItemResponseModel): Promise<DataSourceResponse>;
	delete(key: string): Promise<DataSourceResponse>;
	export(key: string, includeChildren: boolean): Promise<DataSourceResponse<Blob>>;
	import(fileName: string, parentKey?: string): Promise<DataSourceResponse<any>>;
	upload(formData: FormData): Promise<DataSourceResponse<UploadDictionaryResponseModel>>;
	// TODO - temp only
	getLanguages(): Promise<DataSourceResponse<PagedLanguageResponseModel>>;
}
