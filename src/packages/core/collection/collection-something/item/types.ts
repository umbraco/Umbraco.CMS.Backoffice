import type { UmbCollectionItemModel } from '../../types.js';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export interface UmbCollectionSomethingItemContext<ItemType extends UmbCollectionItemModel> extends UmbApi {
	unique?: string;
	entityType?: string;
	item: Observable<ItemType | undefined>;
	isSelectableContext: Observable<boolean>;
	isSelectable: Observable<boolean>;
	isSelected: Observable<boolean>;
	isActive: Observable<boolean>;
	hasActions: Observable<boolean>;
	path: Observable<string>;
	setItem(item: ItemType | undefined): void;
	toggleContextMenu(): void;
	select(): void;
	deselect(): void;
	constructPath(pathname: string, entityType: string, unique: string): string;
}
