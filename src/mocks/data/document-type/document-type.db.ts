import { UmbEntityData } from '../entity.data.js';
import { createEntityTreeItem } from '../utils.js';
import { UmbMockDocumentTypeModel, data } from './document-type.data.js';
import {
	DocumentTypeTreeItemResponseModel,
	DocumentTypeResponseModel,
	DocumentTypeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

class UmbDocumentTypeData extends UmbEntityData<UmbMockDocumentTypeModel> {
	constructor() {
		super(data);
	}

	// TODO: Can we do this smarter so we don't need to make this for each mock data:
	insert(item: DocumentTypeResponseModel) {
		const mockItem: UmbMockDocumentTypeModel = {
			...item,
			type: 'document-type',
			isContainer: false,
			hasChildren: false,
			isFolder: false,
		};

		super.insert(mockItem);
	}

	update(id: string, item: DocumentTypeResponseModel) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super.save(id, item);
	}

	getTreeRoot(): Array<DocumentTypeTreeItemResponseModel> {
		const rootItems = this.data.filter((item) => item.parentId === null);
		return rootItems.map((item) => createDocumentTypeTreeItem(item));
	}

	getTreeItemChildren(id: string): Array<DocumentTypeTreeItemResponseModel> {
		const childItems = this.data.filter((item) => item.parentId === id);
		return childItems.map((item) => createDocumentTypeTreeItem(item));
	}

	getTreeItem(ids: Array<string>): Array<DocumentTypeTreeItemResponseModel> {
		const items = this.data.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => createDocumentTypeTreeItem(item));
	}

	getAllowedTypesOf(id: string): Array<DocumentTypeTreeItemResponseModel> {
		const documentType = this.getById(id);
		const allowedTypeKeys = documentType?.allowedContentTypes?.map((documentType) => documentType.id) ?? [];
		const items = this.data.filter((item) => allowedTypeKeys.includes(item.id ?? ''));
		return items.map((item) => createDocumentTypeTreeItem(item));
	}

	getItems(ids: Array<string>): Array<DocumentTypeItemResponseModel> {
		const items = this.data.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => createDocumentTypeItem(item));
	}
}

export const createDocumentTypeTreeItem = (item: DocumentTypeResponseModel): DocumentTypeTreeItemResponseModel => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return {
		...createEntityTreeItem(item),
		type: 'document-type',
		isElement: item.isElement,
	};
};

const createDocumentTypeItem = (item: DocumentTypeResponseModel): DocumentTypeItemResponseModel => {
	return {
		id: item.id,
		name: item.name,
		isElement: item.isElement,
		icon: item.icon,
	};
};

export const umbDocumentTypeData = new UmbDocumentTypeData();
