import { UmbEntityData } from './entity.data';
import { createDocumentTreeItem } from './utils';
import {
	ContentStateModel,
	DocumentResponseModel,
	DocumentTreeItemResponseModel,
	PagedDocumentTreeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

export const data: Array<DocumentResponseModel> = [
	{
		urls: [
			{
				culture: 'en-US',
				url: '/',
			},
		],
		templateKey: null,
		key: 'all-property-editors-document-key',
		contentTypeKey: 'all-property-editors-document-type-key',
		values: [
			{
				$type: '',
				alias: 'email',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'colorPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'contentPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'eyeDropper',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'multiUrlPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'multiNodeTreePicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'datePicker',
				culture: null,
				segment: null,
				value: '2023-12-24',
			},
			{
				$type: '',
				alias: 'datePickerTime',
				culture: null,
				segment: null,
				value: '2023-12-24 14:52',
			},
			{
				$type: '',
				alias: 'time',
				culture: null,
				segment: null,
				value: '14:52:00',
			},
			{
				$type: '',
				alias: 'email',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'textBox',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'dropdown',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'textArea',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'slider',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'toggle',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'tags',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'markdownEditor',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'radioButtonList',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'checkboxList',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'blockList',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'mediaPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'imageCropper',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'uploadField',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'blockGrid',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'blockGrid',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'numberRange',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'orderDirection',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'overlaySize',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'label',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'integer',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'decimal',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'memberPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'memberGroupPicker',
				culture: null,
				segment: null,
				value: null,
			},
			{
				$type: '',
				alias: 'userPicker',
				culture: null,
				segment: null,
				value: null,
			},
		],
		variants: [
			{
				$type: '',
				state: ContentStateModel.PUBLISHED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'en-us',
				segment: null,
				name: 'All properties',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
		],
	},
	{
		urls: [
			{
				culture: 'en-US',
				url: '/',
			},
		],
		templateKey: null,
		key: 'c05da24d-7740-447b-9cdc-bd8ce2172e38',
		contentTypeKey: '29643452-cff9-47f2-98cd-7de4b6807681',
		values: [
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'masterText',
				value: 'i have a master text',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'pageTitle',
				value: 'with a page title',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'blogPostText',
				value: 'My first blog post',
			},
			{
				$type: '',
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'in the master tab',
			},
			{
				$type: '',
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'which is under another group in the tab',
			},
			{
				$type: '',
				culture: 'da-dk',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'på master dokument tab B',
			},
			{
				$type: '',
				culture: 'da-dk',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'denne er under en anden gruppe i tab B',
			},
			{
				$type: '',
				culture: 'no-no',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'Norsk på master dokument tab B',
			},
			{
				$type: '',
				culture: 'no-no',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'Norsk denne er under en anden gruppe i tab B',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'localBlogTabString',
				value: '1234567',
			},
		],
		variants: [
			{
				$type: '',
				state: ContentStateModel.PUBLISHED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'en-us',
				segment: null,
				name: 'Article in english',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
			{
				$type: '',
				state: ContentStateModel.PUBLISHED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'da-dk',
				segment: null,
				name: 'Artikel på Dansk',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
			{
				$type: '',
				state: ContentStateModel.PUBLISHED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'no-no',
				segment: null,
				name: 'Artikel på Norsk',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
			{
				$type: '',
				state: ContentStateModel.PUBLISHED_PENDING_CHANGES,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'es-es',
				segment: null,
				name: 'Articulo en ingles',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
			{
				$type: '',
				state: ContentStateModel.NOT_CREATED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'pl-pl',
				segment: null,
				name: 'Artykuł w języku polskim',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
		],
	},
	{
		urls: [],
		templateKey: null,
		key: 'fd56a0b5-01a0-4da2-b428-52773bfa9cc4',
		contentTypeKey: '29643452-cff9-47f2-98cd-7de4b6807681',
		values: [
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'masterText',
				value: 'i have a master text B',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'pageTitle',
				value: 'with a page title B',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'blogPostText',
				value: 'My first blog post B',
			},
			{
				$type: '',
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'in the master tab B',
			},
			{
				$type: '',
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'which is under another group in the tab B',
			},
			{
				$type: '',
				culture: 'da-dk',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'på master dokument tab B',
			},
			{
				$type: '',
				culture: 'da-dk',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'denne er under en anden gruppe i tab B',
			},
			{
				$type: '',
				culture: null,
				segment: null,
				alias: 'localBlogTabString',
				value: '1234567890',
			},
		],
		variants: [
			{
				$type: '',
				state: ContentStateModel.DRAFT,
				publishDate: '2023-02-06T15:32:24.957009',
				culture: 'en-us',
				segment: null,
				name: 'Blog post B',
				createDate: '2023-02-06T15:32:05.350038',
				updateDate: '2023-02-06T15:32:24.957009',
			},
		],
	},
	{
		urls: [],
		templateKey: null,
		key: 'simple-document-key',
		contentTypeKey: 'simple-document-type-key',
		variants: [
			{
				$type: '',
				state: ContentStateModel.DRAFT,
				publishDate: '2023-02-06T15:32:24.957009',
				culture: 'en-us',
				segment: null,
				name: 'Blog post B',
				createDate: '2023-02-06T15:32:05.350038',
				updateDate: '2023-02-06T15:32:24.957009',
			},
		],
	},
];

export const treeData: Array<DocumentTreeItemResponseModel> = [
	{
		$type: 'DocumentTreeItemViewModel',
		isProtected: false,
		isPublished: true,
		isEdited: false,
		noAccess: false,
		isTrashed: false,
		key: 'all-property-editors-document-key',
		isContainer: false,
		parentKey: null,
		name: 'All property editors',
		type: 'document',
		icon: 'document',
		hasChildren: false,
	},
	{
		$type: 'DocumentTreeItemViewModel',
		isProtected: false,
		isPublished: true,
		isEdited: false,
		noAccess: false,
		isTrashed: false,
		key: 'c05da24d-7740-447b-9cdc-bd8ce2172e38',
		isContainer: false,
		parentKey: null,
		name: 'Article in english',
		type: 'document',
		icon: 'document',
		hasChildren: true,
	},
	{
		$type: 'DocumentTreeItemViewModel',
		isProtected: false,
		isPublished: false,
		isEdited: false,
		noAccess: false,
		isTrashed: false,
		key: 'fd56a0b5-01a0-4da2-b428-52773bfa9cc4',
		isContainer: false,
		parentKey: 'c05da24d-7740-447b-9cdc-bd8ce2172e38',
		name: 'Blog post B',
		type: 'document',
		icon: 'document',
		hasChildren: false,
	},
	{
		$type: 'DocumentTreeItemViewModel',
		name: 'Document 5',
		type: 'document',
		icon: 'document',
		hasChildren: false,
		key: 'f6n7a5b2-e7c1-463a-956bc-6ck5b9bdf447',
		isContainer: false,
		parentKey: 'cdd30288-2d1c-41b4-89a9-61647b4a10d5',
		noAccess: false,
		isProtected: false,
		isPublished: false,
		isEdited: false,
		isTrashed: false,
	},
	{
		$type: 'DocumentTreeItemViewModel',
		name: 'Simple',
		type: 'document',
		icon: 'document',
		hasChildren: false,
		key: 'simple-document-key',
		isContainer: false,
		parentKey: null,
		noAccess: false,
		isProtected: false,
		isPublished: false,
		isEdited: false,
		isTrashed: false,
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbDocumentData extends UmbEntityData<DocumentResponseModel> {
	private treeData = treeData;

	constructor() {
		super(data);
	}

	getTreeRoot(): PagedDocumentTreeItemResponseModel {
		const items = this.treeData.filter((item) => item.parentKey === null);
		const treeItems = items.map((item) => createDocumentTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItemChildren(key: string): PagedDocumentTreeItemResponseModel {
		const items = this.treeData.filter((item) => item.parentKey === key);
		const treeItems = items.map((item) => createDocumentTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItem(keys: Array<string>): Array<DocumentTreeItemResponseModel> {
		const items = this.treeData.filter((item) => keys.includes(item.key ?? ''));
		return items.map((item) => createDocumentTreeItem(item));
	}
}

export const umbDocumentData = new UmbDocumentData();
