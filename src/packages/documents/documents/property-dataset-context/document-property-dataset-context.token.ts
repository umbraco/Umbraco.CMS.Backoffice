import { UMB_DOCUMENT_ENTITY_TYPE } from '../entity.js';
import type { UmbDocumentPropertyDataContext } from './document-property-dataset-context.js';
import type { UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const IsDocumentPropertyDatasetContext = (
	context: UmbPropertyDatasetContext,
): context is UmbDocumentPropertyDataContext => context.getEntityType() === UMB_DOCUMENT_ENTITY_TYPE;

export const UMB_DOCUMENT_PROPERTY_DATASET_CONTEXT = new UmbContextToken<
	UmbPropertyDatasetContext,
	UmbDocumentPropertyDataContext
>('UmbVariantContext', undefined, IsDocumentPropertyDatasetContext);
