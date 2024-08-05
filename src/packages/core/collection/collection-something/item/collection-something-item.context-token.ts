import type { UmbCollectionItemModel } from '../../types.js';
import type { UmbCollectionSomethingItemContext } from './types.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const UMB_COLLECTION_SOMETHING_ITEM_CONTEXT = new UmbContextToken<
	UmbCollectionSomethingItemContext<UmbCollectionItemModel>
>('UmbCollectionSomethingItemContext');
