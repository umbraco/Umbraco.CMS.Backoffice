import { UmbEntityData } from './entity.data';
import { createDocumentTypeTreeItem } from './utils';
import { DocumentTypeTreeItem, EntityTreeItem, DocumentType } from '@umbraco-cms/backend-api';

export const data: Array<DocumentType> = [
	{
		allowedTemplateKeys: [],
		defaultTemplateKey: null,
		key: '29643452-cff9-47f2-98cd-7de4b6807681',
		alias: 'blogPost',
		name: 'Blog Post',
		description: null,
		icon: 'icon-item-arrangement',
		allowedAsRoot: true,
		variesByCulture: true,
		variesBySegment: false,
		isElement: false,
		properties: [
			{
				key: '5b4ca208-134e-4865-b423-06e5e97adf3c',
				containerKey: 'c3cd2f12-b7c4-4206-8d8b-27c061589f75',
				alias: 'blogPostText',
				name: 'Blog Post Text',
				description: null,
				dataTypeKey: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
				validation: {
					mandatory: true,
					mandatoryMessage: null,
					regEx: null,
					regExMessage: null,
				},
				appearance: {
					labelOnTop: false,
				},
			},
			{
				key: 'ef7096b6-7c9e-49ba-8d49-395111e65ea2',
				containerKey: '227d6ed2-e118-4494-b8f2-deb69854a56a',
				alias: 'blogTextStringUnderMasterTab',
				name: 'Blog text string under master tab',
				description: null,
				dataTypeKey: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
				validation: {
					mandatory: false,
					mandatoryMessage: null,
					regEx: null,
					regExMessage: null,
				},
				appearance: {
					labelOnTop: false,
				},
			},
			{
				key: 'e010c429-b298-499a-9bfe-79687af8972a',
				containerKey: '22177c49-ecba-4f2e-b7fa-3f2c04d02cfb',
				alias: 'blogTextStringUnderGroupUnderMasterTab',
				name: 'Blog text string under group under master tab',
				description: null,
				dataTypeKey: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
				validation: {
					mandatory: false,
					mandatoryMessage: null,
					regEx: null,
					regExMessage: null,
				},
				appearance: {
					labelOnTop: false,
				},
			},
			{
				key: '1a22749a-c7d2-44bb-b36b-c977c2ced6ef',
				containerKey: '2c943997-b685-432d-a6c5-601d8e7a298a',
				alias: 'localBlogTabString',
				name: 'Local Blog Tab String',
				description: null,
				dataTypeKey: '0cc0eba1-9960-42c9-bf9b-60e150b429ae',
				validation: {
					mandatory: true,
					mandatoryMessage: null,
					regEx: '^[0-9]*$',
					regExMessage: null,
				},
				appearance: {
					labelOnTop: true,
				},
			},
		],
		containers: [
			{
				key: 'c3cd2f12-b7c4-4206-8d8b-27c061589f75',
				parentKey: null,
				name: 'Content',
				type: 'Group',
				sortOrder: 0,
			},
			{
				key: '227d6ed2-e118-4494-b8f2-deb69854a56a',
				parentKey: null,
				name: 'Master Tab',
				type: 'Tab',
				sortOrder: 0,
			},
			{
				key: '22177c49-ecba-4f2e-b7fa-3f2c04d02cfb',
				parentKey: '227d6ed2-e118-4494-b8f2-deb69854a56a',
				name: 'Blog Group under master tab',
				type: 'Group',
				sortOrder: 0,
			},
			{
				key: '2c943997-b685-432d-a6c5-601d8e7a298a',
				parentKey: null,
				name: 'Local blog tab',
				type: 'Tab',
				sortOrder: 1,
			},
		],
		allowedContentTypes: [
			{
				key: '29643452-cff9-47f2-98cd-7de4b6807681',
				sortOrder: 0,
			},
		],
		compositions: [
			{
				key: '5035d7d9-0a63-415c-9e75-ee2cf931db92',
				compositionType: 'Inheritance',
			},
			{
				key: '8f68ba66-6fb2-4778-83b8-6ab4ca3a7c5d',
				compositionType: 'Composition',
			},
		],
		cleanup: {
			preventCleanup: false,
			keepAllVersionsNewerThanDays: null,
			keepLatestVersionPerDayForDays: null,
		},
	},
];

export const treeData: Array<DocumentTypeTreeItem> = [
	{
		name: 'Document Type 1',
		type: 'document-type',
		hasChildren: false,
		key: 'd81c7957-153c-4b5a-aa6f-b434a4964624',
		isContainer: false,
		parentKey: null,
		icon: '',
	},
	{
		name: 'Document Type 2',
		type: 'document-type',
		hasChildren: false,
		key: 'a99e4018-3ffc-486b-aa76-eecea9593d17',
		isContainer: false,
		parentKey: null,
		icon: '',
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbDocumentTypeData extends UmbEntityData<DocumentTypeTreeItem> {
	constructor() {
		super(treeData);
	}

	getTreeRoot(): Array<EntityTreeItem> {
		const rootItems = this.data.filter((item) => item.parentKey === null);
		return rootItems.map((item) => createDocumentTypeTreeItem(item));
	}

	getTreeItemChildren(key: string): Array<EntityTreeItem> {
		const childItems = this.data.filter((item) => item.parentKey === key);
		return childItems.map((item) => createDocumentTypeTreeItem(item));
	}

	getTreeItem(keys: Array<string>): Array<EntityTreeItem> {
		const items = this.data.filter((item) => keys.includes(item.key ?? ''));
		return items.map((item) => createDocumentTypeTreeItem(item));
	}
}

export const umbDocumentTypeData = new UmbDocumentTypeData();
