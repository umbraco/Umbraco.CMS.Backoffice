import { UmbEntityData } from './entity.data';
import { createFolderTreeItem } from './utils';
import type {
	FolderTreeItemResponseModel,
	DataTypeResponseModel,
	CreateFolderRequestModel,
	DataTypeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

// TODO: investigate why we don't get an type as part of the DataTypeModel
export const data: Array<DataTypeResponseModel | FolderTreeItemResponseModel> = [
	{
		$type: '',
		type: 'data-type',
		name: 'Folder 1',
		id: 'dt-folder1',
		parentId: null,
		isFolder: true,
	},
	{
		$type: '',
		type: 'data-type',
		id: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
		parentId: null,
		name: 'Textstring',
		propertyEditorAlias: 'Umbraco.TextBox',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.TextBox',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Text',
		id: 'dt-textBox',
		parentId: null,
		propertyEditorAlias: 'Umbraco.TextBox',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.TextBox',
		values: [
			{
				alias: 'maxChars',
				value: 10,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Text Area',
		id: 'dt-textArea',
		parentId: null,
		propertyEditorAlias: 'Umbraco.TextArea',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.TextArea',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'My JS Property Editor',
		id: 'dt-custom',
		parentId: null,
		propertyEditorAlias: 'Umbraco.JSON',
		propertyEditorUiAlias: 'My.PropertyEditorUI.Custom',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Color Picker',
		id: 'dt-colorPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.ColorPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.ColorPicker',
		values: [
			{
				alias: 'useLabel',
				value: true,
			},
			{
				alias: 'items',
				value: [
					{
						value: '#000000',
						label: 'Black',
					},
					{
						value: '#373737',
						label: 'Dark',
					},
					{
						value: '#9e9e9e',
						label: 'Light',
					},
					{
						value: '#607d8b',
						label: 'Sage',
					},
					{
						value: '#2196f3',
						label: 'Sapphire',
					},
					{
						value: '#03a9f4',
						label: 'Sky',
					},
					{
						value: '#3f51b5',
						label: 'Blue',
					},
					{
						value: '#9c27b0',
						label: 'Magenta',
					},
					{
						value: '#673ab7',
						label: 'Purps',
					},
				],
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Content Picker',
		id: 'dt-contentPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.ContentPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.DocumentPicker',
		values: [
			{
				alias: 'validationLimit',
				value: { min: 2, max: 4 },
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Eye Dropper',
		id: 'dt-eyeDropper',
		parentId: null,
		propertyEditorAlias: 'Umbraco.ColorPicker.EyeDropper',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.EyeDropper',
		values: [
			{
				//showPalette
				alias: 'palette',
				value: [
					'#d0021b',
					'#f5a623',
					'#f8e71c',
					'#8b572a',
					'#7ed321',
					'#417505',
					'#bd10e0',
					'#9013fe',
					'#4a90e2',
					'#50e3c2',
					'#b8e986',
					'#000',
					'#444',
					'#888',
					'#ccc',
					'#fff',
				],
			},
			{
				alias: 'showAlpha',
				value: false,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Multi URL Picker',
		id: 'dt-multiUrlPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MultiUrlPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MultiUrlPicker',
		values: [
			{
				alias: 'overlaySize',
				value: 'small',
			},
			{
				alias: 'hideAnchor',
				value: false,
			},
			{
				alias: 'ignoreUserStartNodes',
				value: false,
			},
			{
				alias: 'maxNumber',
				value: 2,
			},
			{
				alias: 'minNumber',
				value: 0,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Multi Node Tree Picker',
		id: 'dt-multiNodeTreePicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MultiNodeTreePicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.TreePicker',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Date Picker',
		id: 'dt-datePicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.DateTime',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.DatePicker',
		values: [
			{
				alias: 'format',
				value: 'YYYY-MM-DD',
			},
			{
				alias: 'offsetTime',
				value: true,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Date Picker With Time',
		id: 'dt-datePicker-time',
		parentId: null,
		propertyEditorAlias: 'Umbraco.DateTime',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.DatePicker',
		values: [
			{
				alias: 'format',
				value: 'YYYY-MM-DD HH:mm:ss',
			},
			{
				alias: 'offsetTime',
				value: true,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Time',
		id: 'dt-time',
		parentId: null,
		propertyEditorAlias: 'Umbraco.DateTime',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.DatePicker',
		values: [
			{
				alias: 'format',
				value: 'HH:mm:ss',
			},
			{
				alias: 'offsetTime',
				value: false,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Email',
		id: 'dt-email',
		parentId: null,
		propertyEditorAlias: 'Umbraco.EmailAddress',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Email',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Multiple Text String',
		id: 'dt-multipleTextString',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MultipleTextString',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MultipleTextString',
		values: [
			{
				alias: 'minNumber',
				value: 2,
			},
			{
				alias: 'maxNumber',
				value: 4,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Dropdown',
		id: 'dt-dropdown',
		parentId: null,
		propertyEditorAlias: 'Umbraco.DropDown.Flexible',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Dropdown',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Slider',
		id: 'dt-slider',
		parentId: null,
		propertyEditorAlias: 'Umbraco.Slider',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Slider',
		values: [
			{
				alias: 'enableRange',
				value: true,
			},
			{
				alias: 'initVal1',
				value: 10,
			},
			{
				alias: 'initVal2',
				value: 40,
			},
			{
				alias: 'maxVal',
				value: 50,
			},
			{
				alias: 'minVal',
				value: 0,
			},
			{
				alias: 'step',
				value: 10,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Toggle',
		id: 'dt-toggle',
		parentId: null,
		propertyEditorAlias: 'Umbraco.TrueFalse',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Toggle',
		values: [
			{
				alias: 'default',
				value: false,
			},
			{
				alias: 'labelOff',
				value: 'Not activated',
			},
			{
				alias: 'labelOn',
				value: 'Activated',
			},
			{
				alias: 'showLabels',
				value: true,
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Tags',
		id: 'dt-tags',
		parentId: null,
		propertyEditorAlias: 'Umbraco.Tags',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Tags',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Markdown Editor',
		id: 'dt-markdownEditor',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MarkdownEditor',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MarkdownEditor',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Radio Button List',
		id: 'dt-radioButtonList',
		parentId: null,
		propertyEditorAlias: 'Umbraco.RadioButtonList',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.RadioButtonList',
		values: [
			{
				alias: 'items',
				value: {
					0: { sortOrder: 1, value: 'First Option' },
					1: { sortOrder: 2, value: 'Second Option' },
					2: { sortOrder: 3, value: 'I Am the third Option' },
				},
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Checkbox List',
		id: 'dt-checkboxList',
		parentId: null,
		propertyEditorAlias: 'Umbraco.CheckboxList',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.CheckboxList',
		values: [
			{
				alias: 'items',
				value: {
					0: { sortOrder: 1, value: 'First Option' },
					1: { sortOrder: 2, value: 'Second Option' },
					2: { sortOrder: 3, value: 'I Am the third Option' },
				},
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Block List',
		id: 'dt-blockList',
		parentId: null,
		propertyEditorAlias: 'Umbraco.BlockList',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.BlockList',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Media Picker',
		id: 'dt-mediaPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MediaPicker3',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MediaPicker',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Image Cropper',
		id: 'dt-imageCropper',
		parentId: null,
		propertyEditorAlias: 'Umbraco.ImageCropper',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.ImageCropper',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Upload Field',
		id: 'dt-uploadField',
		parentId: null,
		propertyEditorAlias: 'Umbraco.UploadField',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.UploadField',
		values: [
			{
				alias: 'fileExtensions',
				value: ['jpg', 'jpeg', 'png'],
			},
		],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Block Grid',
		id: 'dt-blockGrid',
		parentId: null,
		propertyEditorAlias: 'Umbraco.BlockGrid',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.BlockGrid',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Collection View',
		id: 'dt-collectionView',
		parentId: null,
		propertyEditorAlias: 'Umbraco.ListView',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.CollectionView',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Icon Picker',
		id: 'dt-iconPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.IconPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.IconPicker',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Number Range',
		id: 'dt-numberRange',
		parentId: null,
		propertyEditorAlias: 'Umbraco.JSON',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.NumberRange',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Order Direction',
		id: 'dt-orderDirection',
		parentId: null,
		propertyEditorAlias: 'Umbraco.JSON',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.OrderDirection',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Overlay Size',
		id: 'dt-overlaySize',
		parentId: null,
		propertyEditorAlias: 'Umbraco.JSON',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.OverlaySize',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Rich Text Editor',
		id: 'dt-richTextEditor',
		parentId: null,
		propertyEditorAlias: 'Umbraco.TinyMCE',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.TinyMCE',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Label',
		id: 'dt-label',
		parentId: null,
		propertyEditorAlias: 'Umbraco.Label',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Label',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Integer',
		id: 'dt-integer',
		parentId: null,
		propertyEditorAlias: 'Umbraco.Integer',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Integer',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Decimal',
		id: 'dt-decimal',
		parentId: null,
		propertyEditorAlias: 'Umbraco.Decimal',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.Decimal',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'User Picker',
		id: 'dt-userPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.UserPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.UserPicker',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Member Picker',
		id: 'dt-memberPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MemberPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MemberPicker',
		values: [],
	},
	{
		$type: '',
		type: 'data-type',
		name: 'Member Group Picker',
		id: 'dt-memberGroupPicker',
		parentId: null,
		propertyEditorAlias: 'Umbraco.MemberGroupPicker',
		propertyEditorUiAlias: 'Umb.PropertyEditorUI.MemberGroupPicker',
		values: [],
	},
];

const createDataTypeItem = (item: DataTypeResponseModel | FolderTreeItemResponseModel): DataTypeItemResponseModel => {
	return {
		id: item.id,
		name: item.name,
	};
};

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbDataTypeData extends UmbEntityData<DataTypeResponseModel | FolderTreeItemResponseModel> {
	constructor() {
		super(data);
	}

	getTreeRoot(): Array<FolderTreeItemResponseModel> {
		const rootItems = this.data.filter((item) => item.parentId === null);
		return rootItems.map((item) => createFolderTreeItem(item));
	}

	getTreeItemChildren(id: string): Array<FolderTreeItemResponseModel> {
		const childItems = this.data.filter((item) => item.parentId === id);
		return childItems.map((item) => createFolderTreeItem(item));
	}

	getItems(ids: Array<string>): Array<DataTypeItemResponseModel> {
		const items = this.data.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => createDataTypeItem(item));
	}

	createFolder(folder: CreateFolderRequestModel & { id: string | undefined }) {
		const newFolder: FolderTreeItemResponseModel = {
			name: folder.name,
			id: folder.id,
			parentId: folder.parentId,
			$type: 'FolderTreeItemResponseModel',
			isFolder: true,
			isContainer: false,
		};

		this.data.push(newFolder);
	}

	// TODO: this could be reused across other types that support folders
	deleteFolder(id: string) {
		const item = this.getById(id) as FolderTreeItemResponseModel;
		if (!item) throw new Error(`Item with id ${id} not found`);
		if (!item.isFolder) throw new Error(`Item with id ${id} is not a folder`);
		this.data = this.data.filter((item) => item.id !== id);
	}
}

export const umbDataTypeData = new UmbDataTypeData();
