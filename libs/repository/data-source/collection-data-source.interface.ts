import type { UmbPagedData } from '../tree-repository.interface';
import type { DataSourceResponse } from '../../repository';

export interface UmbCollectionDataSource<ItemType = any, PagedItemType = UmbPagedData<ItemType>> {
	getCollection(): Promise<DataSourceResponse<PagedItemType>>;
}
