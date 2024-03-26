import type {
	FolderTreeItemResponseModel,
	FileSystemTreeItemPresentationModel,
	NamedEntityTreeItemResponseModel,
} from '@umbraco-cms/backoffice/external/backend-api';

export const createEntityTreeItem = (item: any): NamedEntityTreeItemResponseModel => {
	return {
		name: item.name,
		hasChildren: item.hasChildren,
		id: item.id,
		parent: item.parent,
	};
};

export const folderTreeItemMapper = (item: any): FolderTreeItemResponseModel => {
	return {
		...createEntityTreeItem(item),
		isFolder: item.isFolder,
	};
};

export const createFileSystemTreeItem = (item: any): FileSystemTreeItemPresentationModel => {
	return {
		path: item.path,
		parent: item.parent ?? null,
		name: item.name,
		hasChildren: item.hasChildren ?? false,
		isFolder: item.isFolder ?? false,
	};
};

export const arrayFilter = (filterBy: Array<string>, value?: Array<string>): boolean => {
	// if a filter is not set, return all items
	if (!filterBy) {
		return true;
	}

	return filterBy.some((filterValue: string) => value?.includes(filterValue));
};

export const stringFilter = (filterBy: Array<string>, value?: string): boolean => {
	// if a filter is not set, return all items
	if (!filterBy || !value) {
		return true;
	}
	return filterBy.includes(value);
};

export const queryFilter = (filterBy: string, value?: string) => {
	if (!filterBy || !value) {
		return true;
	}

	const query = filterBy.toLowerCase();
	return value.toLowerCase().includes(query);
};
