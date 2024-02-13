import type { UmbDocumentDetailModel } from '../types.js';
import type { UmbDocumentCollectionFilterModel } from './types.js';
import { UMB_DOCUMENT_TABLE_COLLECTION_VIEW_ALIAS } from './views/index.js';
import { UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbDocumentCollectionContext extends UmbDefaultCollectionContext<
	UmbDocumentDetailModel,
	UmbDocumentCollectionFilterModel
> {
	constructor(host: UmbControllerHost) {
		super(host, { pageSize: 2, defaultViewAlias: UMB_DOCUMENT_TABLE_COLLECTION_VIEW_ALIAS });

		this.selection.setSelectable(true);
	}
}
