import type { Observable } from 'rxjs';
import { ProblemDetailsModel, TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';

export interface UmbPagedData<T> {
	total: number;
	items: Array<T>;
}

export interface UmbTreeRepository<
	TreeItemType extends TreeItemPresentationModel,
	PagedItemType = UmbPagedData<TreeItemType>
> {
	requestTreeRoot: () => Promise<{
		data?: TreeItemType;
		error?: ProblemDetailsModel;
	}>;

	requestRootTreeItems: () => Promise<{
		data?: PagedItemType;
		error?: ProblemDetailsModel;
		asObservable?: () => Observable<TreeItemType[]>;
	}>;

	requestTreeItemsOf: (parentUnique: string | null) => Promise<{
		data?: PagedItemType;
		error?: ProblemDetailsModel;
		asObservable?: () => Observable<TreeItemType[]>;
	}>;

	// TODO: remove this when all repositories are migrated to the new interface items interface
	requestItemsLegacy?: (uniques: string[]) => Promise<{
		data?: Array<TreeItemType>;
		error?: ProblemDetailsModel;
		asObservable?: () => Observable<any[]>;
	}>;

	rootTreeItems: () => Promise<Observable<TreeItemType[]>>;

	treeItemsOf: (parentUnique: string | null) => Promise<Observable<TreeItemType[]>>;

	// TODO: remove this when all repositories are migrated to the new items interface
	itemsLegacy?: (uniques: string[]) => Promise<Observable<any[]>>;
}
