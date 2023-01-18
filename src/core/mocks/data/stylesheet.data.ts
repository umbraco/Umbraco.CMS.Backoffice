import { UmbEntityData } from './entity.data';
import { createFileSystemTreeItem } from './utils';
import type { PagedFileSystemTreeItem } from '@umbraco-cms/backend-api';
import type { StylesheetDetails } from '@umbraco-cms/models';

export const data: Array<StylesheetDetails> = [
	{
		path: 'New stylesheet.css',
		isFolder: false,
		name: 'New stylesheet.css',
		type: 'stylesheet',
		icon: 'umb:brackets',
		hasChildren: false,
		content: '',
	},
	{
		path: 'folder 1',
		isFolder: false,
		name: 'Folder 1',
		type: 'stylesheet',
		icon: 'umb:folder',
		hasChildren: true,
		content: '',
	},
	{
		path: 'folder 1/Another One.css',
		isFolder: false,
		name: 'Another One.css',
		type: 'stylesheet',
		icon: 'umb:brackets',
		hasChildren: false,
		content: '',
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbStylesheetData extends UmbEntityData<StylesheetDetails> {
	constructor() {
		super(data);
	}

	getByPath(path: string): StylesheetDetails | undefined {
		return this.data.find((item) => item.path === path);
	}

	getTreeRoot(): PagedFileSystemTreeItem {
		const items = this.data.filter((item) => item.path?.includes('/') === false);
		const treeItems = items.map((item) => createFileSystemTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItemChildren(path: string): PagedFileSystemTreeItem {
		const items = this.data.filter((item) => item.path?.startsWith(path + '/'));
		const treeItems = items.map((item) => createFileSystemTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItem(paths: Array<string>): PagedFileSystemTreeItem {
		const items = this.data.filter((item) => paths?.includes(item.path ?? ''));
		const treeItems = items.map((item) => createFileSystemTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}
}

export const umbStylesheetData = new UmbStylesheetData();
