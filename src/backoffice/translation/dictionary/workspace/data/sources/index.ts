import { ContentResult, DictionaryImport, DictionaryItem, PagedDictionaryOverview, PagedLanguage } from "@umbraco-cms/backend-api";
import type { DataSourceResponse } from "@umbraco-cms/models";

export interface DictionaryDetailDataSource {
    createScaffold(parentKey: string): Promise<DataSourceResponse<DictionaryItem>>;
    get(skip?: number, take?: number): Promise<DataSourceResponse<PagedDictionaryOverview>>;
    getByKey(key: string): Promise<DataSourceResponse<DictionaryItem>>;
    insert(parentKey: string, name: string): Promise<DataSourceResponse>;
    update(dictionary: DictionaryItem): Promise<DataSourceResponse>;
    delete(key: string): Promise<DataSourceResponse>;
    export(key: string, includeChildren: boolean): Promise<DataSourceResponse<Blob>>;
    import(file: string, parentId?: number): Promise<DataSourceResponse<ContentResult>>;
    upload(formData: FormData): Promise<DataSourceResponse<DictionaryImport>>;
    // TODO - temp only
    getLanguages(): Promise<DataSourceResponse<PagedLanguage>>;
}