import { UmbTreeItemModelBase } from '../types.js';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { ProblemDetails } from '@umbraco-cms/backoffice/backend-api';
import { UmbPagedData } from '@umbraco-cms/backoffice/repository';

export interface UmbTreeItemContext<TreeItemType extends UmbTreeItemModelBase> {
	unique?: string | null;
	entityType?: string;
	treeItem: Observable<TreeItemType | undefined>;
	hasChildren: Observable<boolean>;
	isLoading: Observable<boolean>;
	isSelectableContext: Observable<boolean>;
	isSelectable: Observable<boolean>;
	isSelected: Observable<boolean>;
	isActive: Observable<boolean>;
	hasActions: Observable<boolean>;
	path: Observable<string>;

	setTreeItem(treeItem: TreeItemType | undefined): void;
	requestChildren(): Promise<{
		data?: UmbPagedData<TreeItemType> | undefined;
		error?: ProblemDetails | undefined;
		asObservable?: () => Observable<TreeItemType[]>;
	}>;
	toggleContextMenu(): void;
	select(): void;
	deselect(): void;
	constructPath(pathname: string, entityType: string, unique: string): string;
}
