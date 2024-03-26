import { UmbEntityData } from '../entity.data.js';
import { createEntityTreeItem } from '../utils.js';
import type {
	EntityTreeItemResponseModel,
	NamedEntityTreeItemResponseModel,
	RelationTypeResponseModel,
} from '@umbraco-cms/backoffice/external/backend-api';

export const data: Array<RelationTypeResponseModel> = [
	{
		id: 'e0d39ff5-71d8-453f-b682-9d8d31ee5e06',
		alias: 'relateDocumentOnCopy',
		name: 'Relate Document On Copy',
		path: '',
		isDeletable: true,
		isBidirectional: false,
		isDependency: false,
		parentObjectType: 'Document',
		childObjectType: 'Document',
		parentObjectTypeName: 'Document',
		childObjectTypeName: 'Document',
	},
	{
		id: 'ac68cde6-763f-4231-a751-1101b57defd2',
		alias: 'relateParentDocumentOnDelete',
		name: 'Relate Parent Document On Delete',
		path: '',
		isDeletable: true,
		isBidirectional: false,
		isDependency: false,
		parentObjectType: 'Document',
		childObjectType: 'Document',
		parentObjectTypeName: 'Document',
		childObjectTypeName: 'Document',
	},
	{
		id: '6f9b800c-762c-42d4-85d9-bf40a77d689e',
		alias: 'relateParentMediaFolderOnDelete',
		name: 'Relate Parent Media Folder On Delete',
		path: '',
		isDeletable: true,
		isBidirectional: false,
		isDependency: false,
		parentObjectType: 'Document',
		childObjectType: 'Document',
		parentObjectTypeName: 'Document',
		childObjectTypeName: 'Document',
	},
	{
		id: 'd421727d-43de-4205-b4c6-037404f309ad',
		alias: 'relatedMedia',
		name: 'Related Media',
		path: '',
		isDeletable: true,
		isBidirectional: false,
		isDependency: false,
		parentObjectType: 'Document',
		childObjectType: 'Document',
		parentObjectTypeName: 'Document',
		childObjectTypeName: 'Document',
	},
	{
		id: 'e9a0a28e-2d5b-4229-ac00-66f2df230513',
		alias: 'relatedDocument',
		name: 'Related Document',
		path: '',
		isDeletable: true,
		isBidirectional: false,
		isDependency: false,
		parentObjectType: 'Document',
		childObjectType: 'Document',
		parentObjectTypeName: 'Document',
		childObjectTypeName: 'Document',
	},
];

export const treeData: Array<NamedEntityTreeItemResponseModel> = [
	{
		id: 'e0d39ff5-71d8-453f-b682-9d8d31ee5e06',
		parent: null,
		name: 'Relate Document On Copy',
		hasChildren: false,
	},
	{
		id: 'ac68cde6-763f-4231-a751-1101b57defd2',

		parent: null,
		name: 'Relate Parent Document On Delete',
		hasChildren: false,
	},
	{
		id: '6f9b800c-762c-42d4-85d9-bf40a77d689e',
		parent: null,
		name: 'Relate Parent Media Folder On Delete',
		hasChildren: false,
	},
	{
		id: 'd421727d-43de-4205-b4c6-037404f309ad',
		parent: null,
		name: 'Related Media',
		hasChildren: false,
	},
	{
		id: 'e9a0a28e-2d5b-4229-ac00-66f2df230513',
		parent: null,
		name: 'Related Document',
		hasChildren: false,
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbRelationTypeData extends UmbEntityData<RelationTypeResponseModel> {
	private treeData = treeData;
	constructor() {
		super(data);
	}

	//TODO Can relation types have children?
	getTreeRoot(): Array<EntityTreeItemResponseModel> {
		const rootItems = this.treeData;
		return rootItems.map((item) => createEntityTreeItem(item));
	}

	//TODO Can relation types have children?
	getTreeItemChildren(id: string): Array<EntityTreeItemResponseModel> {
		const childItems = this.treeData.filter((item) => item.parent?.id === id);
		return childItems.map((item) => createEntityTreeItem(item));
	}

	getTreeItem(ids: Array<string>): Array<EntityTreeItemResponseModel> {
		const items = this.treeData.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => createEntityTreeItem(item));
	}
}

export const umbRelationTypeData = new UmbRelationTypeData();
