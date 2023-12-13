import { UmbDocumentTreeItemModel } from './types.js';
import { UmbTreeServerDataSourceBase } from '@umbraco-cms/backoffice/tree';
import { DocumentResource, DocumentTreeItemResponseModel } from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * A data source for the Document tree that fetches data from the server
 * @export
 * @class UmbDocumentTreeServerDataSource
 * @extends {UmbTreeServerDataSourceBase}
 */
export class UmbDocumentTreeServerDataSource extends UmbTreeServerDataSourceBase<
	DocumentTreeItemResponseModel,
	UmbDocumentTreeItemModel
> {
	/**
	 * Creates an instance of UmbDocumentTreeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbDocumentTreeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		super(host, {
			getRootItems,
			getChildrenOf,
			mapper,
		});
	}
}

// eslint-disable-next-line local-rules/no-direct-api-import
const getRootItems = () => DocumentResource.getTreeDocumentRoot({});

const getChildrenOf = (parentUnique: string | null) => {
	if (parentUnique === null) {
		return getRootItems();
	} else {
		// eslint-disable-next-line local-rules/no-direct-api-import
		return DocumentResource.getTreeDocumentChildren({
			parentId: parentUnique,
		});
	}
};

const mapper = (item: DocumentTreeItemResponseModel): UmbDocumentTreeItemModel => {
	return {
		id: item.id,
		parentId: item.parentId || null,
		name: item.name,
		entityType: 'document',
		isContainer: item.isContainer,
		hasChildren: item.hasChildren,
		isProtected: item.isProtected,
		isPublished: item.isPublished,
		isEdited: item.isEdited,
		contentTypeId: item.contentTypeId,
		variants:
			item.variants?.map((variant) => ({
				name: variant.name!,
				culture: variant.culture!,
				state: variant.state!,
			})) || [],
		icon: item.icon,
		isFolder: false,
	};
};
