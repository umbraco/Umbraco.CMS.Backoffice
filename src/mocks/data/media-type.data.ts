import { UmbEntityData } from './entity.data.js';
import { createFolderTreeItem, createMediaTypeTreeItem } from './utils.js';
import {
	FolderTreeItemResponseModel,
	MediaTypeResponseModel,
	MediaTypeTreeItemResponseModel,
	PagedMediaTreeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

export const data: Array<MediaTypeResponseModel> = [
	{
		name: 'Media Type 1',
		id: 'c5159663-eb82-43ee-bd23-e42dc5e71db6',
		description: 'Media type 1 description',
		alias: 'mediaType1',
		icon: 'icon-bug',
		properties: [],
		containers: [],
	},
];

export const treeData: Array<MediaTypeTreeItemResponseModel> = [
	{
		name: data[0].name,
		id: data[0].id,
		icon: data[0].icon,
		type: 'media-type',
		hasChildren: false,
		isContainer: false,
		parentId: null,
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbMediaTypeData extends UmbEntityData<MediaTypeResponseModel> {
	private treeData = treeData;

	constructor() {
		super(data);
	}

	// TODO: Can we do this smarter so we don't need to make this for each mock data:
	insert(item: MediaTypeResponseModel) {
		const result = super.insert(item);
		this.treeData.push(createMediaTypeTreeItem(result));
		return result;
	}

	update(id: string, item: MediaTypeResponseModel) {
		const result = super.save(id, item);
		this.treeData = this.treeData.map((x) => {
			if (x.id === result.id) {
				return createMediaTypeTreeItem(result);
			} else {
				return x;
			}
		});
		return result;
	}

	getItems(ids: Array<string>): Array<MediaTypeTreeItemResponseModel> {
		const items = this.data.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => item);
	}

	getTreeRoot(): Array<MediaTypeTreeItemResponseModel> {
		const rootItems = this.treeData.filter((item) => item.parentId === null);
		const result = rootItems.map((item) => createMediaTypeTreeItem(item));
		return result;
	}

	getTreeItemChildren(id: string): Array<MediaTypeTreeItemResponseModel> {
		const childItems = this.treeData.filter((item) => item.parentId === id);
		return childItems.map((item) => item);
	}

	getTreeItems(ids: Array<string>): Array<MediaTypeTreeItemResponseModel> {
		const items = this.treeData.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => item);
	}

	getAllowedTypesOf(id: string): Array<MediaTypeTreeItemResponseModel> {
		const mediaType = this.getById(id);
		const allowedTypeKeys = mediaType?.allowedContentTypes?.map((mediaType) => mediaType.id) ?? [];
		const items = this.treeData.filter((item) => allowedTypeKeys.includes(item.id ?? ''));
		return items.map((item) => item);
	}
}

export const umbMediaTypeData = new UmbMediaTypeData();
