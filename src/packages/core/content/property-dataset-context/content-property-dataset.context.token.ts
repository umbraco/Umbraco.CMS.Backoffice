import type { UmbContentPropertyDatasetContext } from './content-property-dataset.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const UMB_CONTENT_PROPERTY_DATASET_CONTEXT = new UmbContextToken<UmbContentPropertyDatasetContext>(
	'UmbPropertyDatasetContext',
);
