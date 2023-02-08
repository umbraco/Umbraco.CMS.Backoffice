import { UmbEntityData } from './entity.data';
import { createDocumentTreeItem } from './utils';
import { ContentState, Document, DocumentTreeItem, PagedDocumentTreeItem } from '@umbraco-cms/backend-api';

/*

{
		name: 'All Property Editors',
		type: 'document',
		icon: 'favorite',
		hasChildren: false,
		key: '6f31e382-458c-4f96-97ea-cc26c41009d4',
		isContainer: false,
		parentKey: null,
		noAccess: false,
		isProtected: false,
		isPublished: false,
		isEdited: false,
		isTrashed: false,
		properties: [
			{
				alias: 'colorPicker',
				label: 'Color Picker',
				description: '',
				dataTypeKey: 'dt-colorPicker',
			},
			{
				alias: 'contentPicker',
				label: 'Content Picker',
				description: '',
				dataTypeKey: 'dt-contentPicker',
			},
			{
				alias: 'eyeDropper',
				label: 'Eye Dropper',
				description: '',
				dataTypeKey: 'dt-eyeDropper',
			},
			{
				alias: 'multiUrlPicker',
				label: 'Multi URL Picker',
				description: '',
				dataTypeKey: 'dt-multiUrlPicker',
			},
			{
				alias: 'multiNodeTreePicker',
				label: 'Multi Node Tree Picker',
				description: '',
				dataTypeKey: 'dt-multiNodeTreePicker',
			},
			{
				alias: 'datePicker',
				label: 'Date Picker',
				description: '',
				dataTypeKey: 'dt-datePicker',
			},
			{
				alias: 'email',
				label: 'Email',
				description: '',
				dataTypeKey: 'dt-email',
			},
			{
				alias: 'textBox',
				label: 'Text Box',
				description: '',
				dataTypeKey: 'dt-textBox',
			},
			{
				alias: 'dropdown',
				label: 'Dropdown',
				description: '',
				dataTypeKey: 'dt-dropdown',
			},
			{
				alias: 'textArea',
				label: 'Text Area',
				description: '',
				dataTypeKey: 'dt-textArea',
			},
			{
				alias: 'slider',
				label: 'Slider',
				description: '',
				dataTypeKey: 'dt-slider',
			},
			{
				alias: 'toggle',
				label: 'Toggle',
				description: '',
				dataTypeKey: 'dt-toggle',
			},
			{
				alias: 'tags',
				label: 'Tags',
				description: '',
				dataTypeKey: 'dt-tags',
			},
			{
				alias: 'markdownEditor',
				label: 'MarkdownEditor',
				description: '',
				dataTypeKey: 'dt-markdownEditor',
			},
			{
				alias: 'radioButtonList',
				label: 'Radio Button List',
				description: '',
				dataTypeKey: 'dt-radioButtonList',
			},
			{
				alias: 'checkboxList',
				label: 'Checkbox List',
				description: '',
				dataTypeKey: 'dt-checkboxList',
			},
			{
				alias: 'blockList',
				label: 'Block List',
				description: '',
				dataTypeKey: 'dt-blockList',
			},
			{
				alias: 'mediaPicker',
				label: 'Media Picker',
				description: '',
				dataTypeKey: 'dt-mediaPicker',
			},
			{
				alias: 'imageCropper',
				label: 'Image Cropper',
				description: '',
				dataTypeKey: 'dt-imageCropper',
			},
			{
				alias: 'uploadField',
				label: 'Upload Field',
				description: '',
				dataTypeKey: 'dt-uploadField',
			},
			{
				alias: 'blockGrid',
				label: 'Block Grid',
				description: '',
				dataTypeKey: 'dt-blockGrid',
			},
			{
				alias: 'blockGrid',
				label: 'Icon Picker',
				description: '',
				dataTypeKey: 'dt-iconPicker',
			},
			{
				alias: 'numberRange',
				label: 'Number Range',
				description: '',
				dataTypeKey: 'dt-numberRange',
			},
			{
				alias: 'orderDirection',
				label: 'Order Direction',
				description: '',
				dataTypeKey: 'dt-orderDirection',
			},
			{
				alias: 'overlaySize',
				label: 'Overlay Size',
				description: '',
				dataTypeKey: 'dt-overlaySize',
			},
			{
				alias: 'label',
				label: 'Label',
				description: '',
				dataTypeKey: 'dt-label',
			},
			{
				alias: 'integer',
				label: 'Integer',
				description: '',
				dataTypeKey: 'dt-integer',
			},
			{
				alias: 'decimal',
				label: 'Decimal',
				description: '',
				dataTypeKey: 'dt-decimal',
			},
			{
				alias: 'memberPicker',
				label: 'Member Picker',
				description: '',
				dataTypeKey: 'dt-memberPicker',
			},
			{
				alias: 'memberGroupPicker',
				label: 'Member Group Picker',
				description: '',
				dataTypeKey: 'dt-memberGroupPicker',
			},
			{
				alias: 'userPicker',
				label: 'User Picker',
				description: '',
				dataTypeKey: 'dt-userPicker',
			},
		],
		data: [],
		variants: [],
	},

*/

export const data: Array<Document> = [
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
		properties: [
			{
				culture: null,
				segment: null,
				alias: 'masterText',
				value: 'i have a master text',
			},
			{
				culture: null,
				segment: null,
				alias: 'pageTitle',
				value: 'with a page title',
			},
			{
				culture: null,
				segment: null,
				alias: 'blogPostText',
				value: 'My first blog post',
			},
			{
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderMasterTab',
				value: 'in the master tab',
			},
			{
				culture: 'en-us',
				segment: null,
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				value: 'which is under another group in the tab',
			},
			{
				culture: null,
				segment: null,
				alias: 'localBlogTabString',
				value: '1234567',
			},
		],
		variants: [
			{
				state: ContentState.PUBLISHED,
				publishDate: '2023-02-06T15:31:51.354764',
				culture: 'en-us',
				segment: null,
				name: 'Blog post A',
				createDate: '2023-02-06T15:31:46.876902',
				updateDate: '2023-02-06T15:31:51.354764',
			},
		],
	},
];

// TODO: make tree data:
export const treeData: Array<DocumentTreeItem> = [
	{
		isProtected: false,
		isPublished: true,
		isEdited: false,
		noAccess: false,
		isTrashed: false,
		key: 'c05da24d-7740-447b-9cdc-bd8ce2172e38',
		isContainer: false,
		parentKey: null,
		name: 'Blog post A',
		type: 'document',
		icon: 'icon-item-arrangement',
		hasChildren: true,
	},
	{
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
		icon: 'icon-item-arrangement',
		hasChildren: false,
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbDocumentData extends UmbEntityData<DocumentTreeItem> {
	constructor() {
		super(treeData);
	}

	getTreeRoot(): PagedDocumentTreeItem {
		const items = this.data.filter((item) => item.parentKey === null);
		const treeItems = items.map((item) => createDocumentTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItemChildren(key: string): PagedDocumentTreeItem {
		const items = this.data.filter((item) => item.parentKey === key);
		const treeItems = items.map((item) => createDocumentTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItem(keys: Array<string>): Array<DocumentTreeItem> {
		const items = this.data.filter((item) => keys.includes(item.key ?? ''));
		return items.map((item) => createDocumentTreeItem(item));
	}
}

export const umbDocumentData = new UmbDocumentData();
