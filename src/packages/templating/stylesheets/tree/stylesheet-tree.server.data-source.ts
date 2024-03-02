import { UMB_STYLESHEET_ENTITY_TYPE, UMB_STYLESHEET_FOLDER_ENTITY_TYPE } from '../entity.js';
import type { UmbStylesheetTreeItemModel } from './types.js';
import { UmbServerFilePathUniqueSerializer } from '@umbraco-cms/backoffice/server-file-system';
import type { FileSystemTreeItemPresentationModel } from '@umbraco-cms/backoffice/external/backend-api';
import { StylesheetResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbTreeChildrenOfRequestArgs, UmbTreeRootItemsRequestArgs } from '@umbraco-cms/backoffice/tree';
import { UmbTreeServerDataSourceBase } from '@umbraco-cms/backoffice/tree';

/**
 * A data source for the Stylesheet tree that fetches data from the server
 * @export
 * @class UmbStylesheetTreeServerDataSource
 * @implements {UmbTreeServerDataSourceBase}
 */
export class UmbStylesheetTreeServerDataSource extends UmbTreeServerDataSourceBase<
	FileSystemTreeItemPresentationModel,
	UmbStylesheetTreeItemModel
> {
	/**
	 * Creates an instance of UmbStylesheetTreeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbStylesheetTreeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		super(host, {
			getRootItems,
			getChildrenOf,
			mapper,
		});
	}
}

const getRootItems = (args: UmbTreeRootItemsRequestArgs) =>
	// eslint-disable-next-line local-rules/no-direct-api-import
	StylesheetResource.getTreeStylesheetRoot({ skip: args.skip, take: args.take });

const getChildrenOf = (args: UmbTreeChildrenOfRequestArgs) => {
	const parentPath = new UmbServerFilePathUniqueSerializer().toServerPath(args.parentUnique);

	if (parentPath === null) {
		return getRootItems(args);
	} else {
		// eslint-disable-next-line local-rules/no-direct-api-import
		return StylesheetResource.getTreeStylesheetChildren({
			parentPath,
		});
	}
};

const mapper = (item: FileSystemTreeItemPresentationModel): UmbStylesheetTreeItemModel => {
	const serializer = new UmbServerFilePathUniqueSerializer();

	return {
		unique: serializer.toUnique(item.path),
		parentUnique: item.parent ? serializer.toUnique(item.parent?.path) : null,
		entityType: item.isFolder ? UMB_STYLESHEET_FOLDER_ENTITY_TYPE : UMB_STYLESHEET_ENTITY_TYPE,
		name: item.name,
		isFolder: item.isFolder,
		hasChildren: item.hasChildren,
		icon: item.isFolder ? undefined : 'icon-brush-alt',
	};
};
