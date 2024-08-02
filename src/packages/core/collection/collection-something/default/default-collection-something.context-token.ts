import type { UmbDefaultCollectionSomethingContext } from './default-collection-something.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const UMB_COLLECTION_SOMETHING_CONTEXT = new UmbContextToken<UmbDefaultCollectionSomethingContext<any>>(
	'UmbCollectionSomethingContext',
);
