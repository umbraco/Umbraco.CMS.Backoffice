import { UmbEntityTreeData } from './entity-tree.data.js';
import { UmbEntityData } from './entity.data.js';
import { createFolderTreeItem } from './utils.js';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type {
	FolderTreeItemResponseModel,
	DataTypeResponseModel,
	CreateFolderRequestModel,
	DataTypeItemResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

// TODO: investigate why we don't get an type as part of the DataTypeModel
export const data: Array<DataTypeResponseModel | FolderTreeItemResponseModel> = [
	{
		type: 'data-type',
		name: 'Folder 1',
		id: 'dt-folder1',
		parentId: null,
		isFolder: true,
		hasChildren: false,
		isContainer: false,
	},
	{
		type: 'data-type',
		name: 'Folder 2',
		id: 'dt-folder2',
		parentId: null,
		isFolder: true,
		hasChildren: true,
		isContainer: false,
	},
	{
		type: 'data-type',
		id: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
		parentId: null,
		name: 'Textstring',
		editorAlias: 'Umbraco.TextBox',
		editorUiAlias: 'Umb.PropertyEditorUi.TextBox',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Text',
		id: 'dt-textBox',
		parentId: null,
		editorAlias: 'Umbraco.TextBox',
		editorUiAlias: 'Umb.PropertyEditorUi.TextBox',
		values: [
			{
				alias: 'maxChars',
				value: 10,
			},
		],
	},
	{
		type: 'data-type',
		name: 'Text Area',
		id: 'dt-textArea',
		parentId: null,
		editorAlias: 'Umbraco.TextArea',
		editorUiAlias: 'Umb.PropertyEditorUi.TextArea',
		values: [],
	},
	{
		type: 'data-type',
		name: 'My JS Property Editor',
		id: 'dt-custom',
		parentId: null,
		editorAlias: 'Umbraco.Label',
		editorUiAlias: 'My.PropertyEditorUI.Custom',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Color Picker',
		id: 'dt-colorPicker',
		parentId: null,
		editorAlias: 'Umbraco.ColorPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.ColorPicker',
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
		type: 'data-type',
		name: 'Content Picker',
		id: 'dt-contentPicker',
		parentId: null,
		editorAlias: 'Umbraco.ContentPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.DocumentPicker',
		values: [
			{
				alias: 'validationLimit',
				value: { min: 2, max: 4 },
			},
		],
	},
	{
		type: 'data-type',
		name: 'Eye Dropper',
		id: 'dt-eyeDropper',
		parentId: null,
		editorAlias: 'Umbraco.ColorPicker.EyeDropper',
		editorUiAlias: 'Umb.PropertyEditorUi.EyeDropper',
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
		type: 'data-type',
		name: 'Multi URL Picker',
		id: 'dt-multiUrlPicker',
		parentId: null,
		editorAlias: 'Umbraco.MultiUrlPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.MultiUrlPicker',
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
		type: 'data-type',
		name: 'Multi Node Tree Picker',
		id: 'dt-multiNodeTreePicker',
		parentId: null,
		editorAlias: 'Umbraco.MultiNodeTreePicker',
		editorUiAlias: 'Umb.PropertyEditorUi.TreePicker',
		values: [
			{
				alias: 'startNode',
				value: {
					type: 'content',
					id: null,
				},
			},
			{
				alias: 'minNumber',
				value: 0,
			},
			{
				alias: 'maxNumber',
				value: 3,
			},
			{
				alias: 'ignoreUserStartNodes',
				value: false,
			},
			{
				alias: 'showOpenButton',
				value: true,
			},
			{
				alias: 'filter',
				value: '',
			},
		],
	},
	{
		type: 'data-type',
		name: 'Date Picker',
		id: 'dt-datePicker',
		parentId: null,
		editorAlias: 'Umbraco.DateTime',
		editorUiAlias: 'Umb.PropertyEditorUi.DatePicker',
		values: [
			{
				alias: 'format',
				value: 'YYYY-MM-DDTHH:mm',
			},
			{
				alias: 'offsetTime',
				value: true,
			},
			{
				alias: 'enableTimezones',
				value: true,
			},
		],
	},
	{
		type: 'data-type',
		name: 'Date Picker With Time',
		id: 'dt-datePicker-time',
		parentId: null,
		editorAlias: 'Umbraco.DateTime',
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
		type: 'data-type',
		name: 'Time',
		id: 'dt-time',
		parentId: null,
		editorAlias: 'Umbraco.DateTime',
		editorUiAlias: 'Umb.PropertyEditorUi.DatePicker',
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
		type: 'data-type',
		name: 'Email',
		id: 'dt-email',
		parentId: null,
		editorAlias: 'Umbraco.EmailAddress',
		editorUiAlias: 'Umb.PropertyEditorUi.Email',
		values: [
			{
				alias: 'inputMode',
				value: 'email',
			},
		],
	},
	{
		type: 'data-type',
		name: 'Multiple Text String',
		id: 'dt-multipleTextString',
		parentId: null,
		editorAlias: 'Umbraco.MultipleTextString',
		editorUiAlias: 'Umb.PropertyEditorUi.MultipleTextString',
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
		type: 'data-type',
		name: 'Dropdown',
		id: 'dt-dropdown',
		parentId: null,
		editorAlias: 'Umbraco.DropDown.Flexible',
		editorUiAlias: 'Umb.PropertyEditorUi.Dropdown',
		values: [
			{
				alias: 'multiple',
				value: false,
			},
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
		type: 'data-type',
		name: 'Slider',
		id: 'dt-slider',
		parentId: null,
		editorAlias: 'Umbraco.Slider',
		editorUiAlias: 'Umb.PropertyEditorUi.Slider',
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
		type: 'data-type',
		name: 'Toggle',
		id: 'dt-toggle',
		parentId: null,
		editorAlias: 'Umbraco.TrueFalse',
		editorUiAlias: 'Umb.PropertyEditorUi.Toggle',
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
		type: 'data-type',
		name: 'Tags',
		id: 'dt-tags',
		parentId: null,
		editorAlias: 'Umbraco.Tags',
		editorUiAlias: 'Umb.PropertyEditorUi.Tags',
		values: [
			{
				alias: 'group',
				value: 'Fruits',
			},
			{
				alias: 'items',
				value: [],
			},
		],
	},
	{
		type: 'data-type',
		name: 'Markdown Editor',
		id: 'dt-markdownEditor',
		parentId: null,
		editorAlias: 'Umbraco.MarkdownEditor',
		editorUiAlias: 'Umb.PropertyEditorUi.MarkdownEditor',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Radio Button List',
		id: 'dt-radioButtonList',
		parentId: null,
		editorAlias: 'Umbraco.RadioButtonList',
		editorUiAlias: 'Umb.PropertyEditorUi.RadioButtonList',
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
		type: 'data-type',
		name: 'Checkbox List',
		id: 'dt-checkboxList',
		parentId: null,
		editorAlias: 'Umbraco.CheckboxList',
		editorUiAlias: 'Umb.PropertyEditorUi.CheckboxList',
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
		type: 'data-type',
		name: 'Block List',
		id: 'dt-blockList',
		parentId: null,
		editorAlias: 'Umbraco.BlockList',
		editorUiAlias: 'Umb.PropertyEditorUi.BlockList',
		values: [
			{
				alias: 'blocks',
				value: [
					{
						label: 'Mocked Block Type for Block List',
						contentElementTypeKey: '4f68ba66-6fb2-4778-83b8-6ab4ca3a7c5c',
						icon: 'icon-server-alt',
					},
					{
						label: 'Mocked Coffee Block',
						contentElementTypeKey: 'coffee-umbraco-demo-block-id',
						iconColor: '#FFFDD0',
						backgroundColor: '#633f32',
						editorSize: 'medium',
						icon: 'icon-coffee',
					},

					{
						label: 'Headline',
						contentElementTypeKey: 'headline-umbraco-demo-block-id',
						backgroundColor: 'gold',
						editorSize: 'medium',
						icon: 'icon-edit',
					},
					{
						label: 'Image',
						contentElementTypeKey: 'image-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-picture',
					},
					{
						label: 'Rich Text',
						contentElementTypeKey: 'rich-text-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-diploma',
					},
					{
						label: 'Two Column Layout',
						contentElementTypeKey: 'two-column-layout-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-book-alt',
					},
				],
			},
		],
	},
	{
		type: 'data-type',
		name: 'Media Picker',
		id: 'dt-mediaPicker',
		parentId: null,
		editorAlias: 'Umbraco.MediaPicker3',
		editorUiAlias: 'Umb.PropertyEditorUi.MediaPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Image Cropper',
		id: 'dt-imageCropper',
		parentId: null,
		editorAlias: 'Umbraco.ImageCropper',
		editorUiAlias: 'Umb.PropertyEditorUi.ImageCropper',
		values: [
			{
				alias: 'crops',
				value: [
					{
						alias: 'Square',
						height: 1000,
						width: 1000,
					},
					{
						alias: 'Banner',
						height: 600,
						width: 1200,
					},
					{
						alias: 'Mobile',
						height: 1200,
						width: 800,
					},
				],
			},
		],
	},
	{
		type: 'data-type',
		name: 'Upload Field',
		id: 'dt-uploadField',
		parentId: null,
		editorAlias: 'Umbraco.UploadField',
		editorUiAlias: 'Umb.PropertyEditorUi.UploadField',
		values: [
			{
				alias: 'fileExtensions',
				value: ['jpg', 'jpeg', 'png', 'pdf'],
			},
			{
				alias: 'multiple',
				value: true,
			},
		],
	},
	{
		type: 'data-type',
		name: 'Block Grid',
		id: 'dt-blockGrid',
		parentId: null,
		editorAlias: 'Umbraco.BlockGrid',
		editorUiAlias: 'Umb.PropertyEditorUi.BlockGrid',
		values: [
			{
				alias: 'blockGroups',
				value: [{ key: 'demo-block-group-id', name: 'Demo Blocks' }],
			},
			{
				alias: 'blocks',
				value: [
					{
						label: 'Mocked Block Type for Block Grid',
						contentElementTypeKey: '4f68ba66-6fb2-4778-83b8-6ab4ca3a7c5c',
					},
					{
						label: 'Mocked Coffee Block',
						contentElementTypeKey: 'coffee-umbraco-demo-block-id',
						iconColor: '#FFFDD0',
						backgroundColor: '#633f32',
						editorSize: 'medium',
						icon: 'icon-coffee',
					},

					{
						label: 'Headline',
						contentElementTypeKey: 'headline-umbraco-demo-block-id',
						backgroundColor: 'gold',
						editorSize: 'medium',
						icon: 'icon-edit',
						groupKey: 'demo-block-group-id',
					},
					{
						label: 'Image',
						contentElementTypeKey: 'image-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-picture',

						groupKey: 'demo-block-group-id',
					},
					{
						label: 'Rich Text',
						contentElementTypeKey: 'rich-text-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-diploma',
						groupKey: 'demo-block-group-id',
					},
					{
						label: 'Two Column Layout',
						contentElementTypeKey: 'two-column-layout-umbraco-demo-block-id',
						editorSize: 'medium',
						icon: 'icon-book-alt',
						groupKey: 'demo-block-group-id',
					},
				],
			},
		],
	},
	{
		type: 'data-type',
		name: 'Collection View',
		id: 'dt-collectionView',
		parentId: null,
		editorAlias: 'Umbraco.ListView',
		editorUiAlias: 'Umb.PropertyEditorUi.CollectionView',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Icon Picker',
		id: 'dt-iconPicker',
		parentId: null,
		editorAlias: 'Umbraco.IconPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.IconPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Rich Text Editor',
		id: 'dt-richTextEditor',
		parentId: null,
		editorAlias: 'Umbraco.RichText',
		editorUiAlias: 'Umb.PropertyEditorUi.TinyMCE',
		values: [
			{
				alias: 'hideLabel',
				value: true,
			},
			{ alias: 'dimensions', value: { height: 500 } },
			{ alias: 'maxImageSize', value: 500 },
			{ alias: 'ignoreUserStartNodes', value: false },
			{
				alias: 'validElements',
				value:
					'+a[id|style|rel|data-id|data-udi|rev|charset|hreflang|dir|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],-strong/-b[class|style],-em/-i[class|style],-strike[class|style],-s[class|style],-u[class|style],#p[id|style|dir|class|align],-ol[class|reversed|start|style|type],-ul[class|style],-li[class|style],br[class],img[id|dir|lang|longdesc|usemap|style|class|src|onmouseover|onmouseout|border|alt=|title|hspace|vspace|width|height|align|umbracoorgwidth|umbracoorgheight|onresize|onresizestart|onresizeend|rel|data-id],-sub[style|class],-sup[style|class],-blockquote[dir|style|class],-table[border=0|cellspacing|cellpadding|width|height|class|align|summary|style|dir|id|lang|bgcolor|background|bordercolor],-tr[id|lang|dir|class|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor],tbody[id|class],thead[id|class],tfoot[id|class],#td[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor|scope],-th[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|scope],caption[id|lang|dir|class|style],-div[id|dir|class|align|style],-span[class|align|style],-pre[class|align|style],address[class|align|style],-h1[id|dir|class|align|style],-h2[id|dir|class|align|style],-h3[id|dir|class|align|style],-h4[id|dir|class|align|style],-h5[id|dir|class|align|style],-h6[id|style|dir|class|align|style],hr[class|style],small[class|style],dd[id|class|title|style|dir|lang],dl[id|class|title|style|dir|lang],dt[id|class|title|style|dir|lang],object[class|id|width|height|codebase|*],param[name|value|_value|class],embed[type|width|height|src|class|*],map[name|class],area[shape|coords|href|alt|target|class],bdo[class],button[class],iframe[*],figure,figcaption,video[*],audio[*],picture[*],source[*],canvas[*]',
			},
			{ alias: 'invalidElements', value: 'font' },
			// { alias: 'stylesheets', value: ['/css/rte-content.css'] },
			{
				alias: 'toolbar',
				value: [
					'sourcecode',
					'undo',
					'redo',
					'styles',
					'bold',
					'italic',
					'alignleft',
					'aligncenter',
					'alignright',
					'bullist',
					'numlist',
					'outdent',
					'indent',
					'link',
					'unlink',
					'anchor',
					'table',
					'umbmediapicker',
					'umbmacro',
					'umbembeddialog',
				],
			},
			{
				alias: 'plugins',
				value: [
					{
						name: 'anchor',
					},
					{
						name: 'charmap',
					},
					{
						name: 'table',
					},
					{
						name: 'lists',
					},
					{
						name: 'advlist',
					},
					{
						name: 'autolink',
					},
					{
						name: 'directionality',
					},
					{
						name: 'searchreplace',
					},
				],
			},
		],
	},
	{
		type: 'data-type',
		name: 'Label',
		id: 'dt-label',
		parentId: null,
		editorAlias: 'Umbraco.Label',
		editorUiAlias: 'Umb.PropertyEditorUi.Label',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Integer',
		id: 'dt-integer',
		parentId: null,
		editorAlias: 'Umbraco.Integer',
		editorUiAlias: 'Umb.PropertyEditorUi.Integer',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Decimal',
		id: 'dt-decimal',
		parentId: null,
		editorAlias: 'Umbraco.Decimal',
		editorUiAlias: 'Umb.PropertyEditorUi.Decimal',
		values: [
			{
				alias: 'step',
				value: 0.01,
			},
		],
	},
	{
		type: 'data-type',
		name: 'User Picker',
		id: 'dt-userPicker',
		parentId: null,
		editorAlias: 'Umbraco.UserPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.UserPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'User Group Picker',
		id: 'dt-userGroupPicker',
		parentId: null,
		editorAlias: 'Umbraco.UserGroupPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.UserGroupPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Member Picker',
		id: 'dt-memberPicker',
		parentId: null,
		editorAlias: 'Umbraco.MemberPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.MemberPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Member Group Picker',
		id: 'dt-memberGroupPicker',
		parentId: null,
		editorAlias: 'Umbraco.MemberGroupPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.MemberGroupPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Data Type in folder',
		id: 'dt-data-type-in-folder',
		parentId: 'dt-folder2',
		editorAlias: 'Umbraco.MemberGroupPicker',
		editorUiAlias: 'Umb.PropertyEditorUi.MemberGroupPicker',
		values: [],
	},
	{
		type: 'data-type',
		name: 'Static File Picker',
		id: 'dt-staticFilePicker',
		parentId: null,
		editorAlias: 'Umbraco.Label',
		editorUiAlias: 'Umb.PropertyEditorUi.StaticFilePicker',
		values: [],
	},
];

const createDataTypeItem = (item: DataTypeResponseModel | FolderTreeItemResponseModel): DataTypeItemResponseModel => {
	return {
		id: item.id,
		name: item.name,
	};
};

class UmbDataTypeData extends UmbEntityData<DataTypeResponseModel | FolderTreeItemResponseModel> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	#tree = new UmbEntityTreeData<FolderTreeItemResponseModel>(this);

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

	createFolder(folder: CreateFolderRequestModel) {
		const newFolder: FolderTreeItemResponseModel = {
			type: 'data-type-folder',
			name: folder.name,
			id: folder.id ? folder.id : UmbId.new(),
			parentId: folder.parentId,
			isFolder: true,
			isContainer: false,
			hasChildren: false,
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

	copy(ids: Array<string>, destinationKey: string) {
		return this.#tree.copy(ids, destinationKey);
	}

	move(ids: Array<string>, destinationKey: string) {
		return this.#tree.move(ids, destinationKey);
	}
}

export const umbDataTypeData = new UmbDataTypeData();
