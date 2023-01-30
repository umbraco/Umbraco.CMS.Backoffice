import { UmbEntityData } from './entity.data';
import { createEntityTreeItem } from './utils';
import { EntityTreeItem } from '@umbraco-cms/backend-api';
import type { DictionaryDetails } from '@umbraco-cms/models';

export const data: Array<DictionaryDetails> = [
	{
		parentKey: null,
		name: 'Hello',
		key: 'aae7d0ab-53ba-485d-b8bd-12537f9925cb',
		hasChildren: true,
		type: 'dictionary',
		isContainer: false,
		icon: 'umb:book-alt',
		translations: [{
			displayName: 'English (United States)',
			isoCode: 'en-US',
			key: 'b7e7d0ab-53ba-485d-b8bd-12537f9925ca',
			languageId: 1,
			translation: 'hello in en-US'
		},
		{
			displayName: 'French',
			isoCode: 'fr',
			key: 'be7d0ab-53ba-485d-b8bd-12537f9925cd',
			languageId: 2,
			translation: '',
		}],
	},
	{
		parentKey: 'aae7d0ab-53ba-485d-b8bd-12537f9925cb',
		name: 'Hello again',
		key: 'bbe7d0ab-53bb-485d-b8bd-12537f9925cb',
		hasChildren: false,
		type: 'dictionary',
		isContainer: false,
		icon: 'umb:book-alt',
		translations: [{
			displayName: 'English (United States)',
			isoCode: 'en-US',
			key: 'b7e7d0ab-53ba-485d-b8bd-1253ee9925cb',
			languageId: 1,
			translation: 'Hello again in en-US'
		},
		{
			displayName: 'French',
			isoCode: 'fr',
			key: 'b7e7d0ab-53ba-482d-b8bd-12537f9925cd',
			languageId: 2,
			translation: 'Hello again in French'
		}],
	},
];

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbDictionaryData extends UmbEntityData<DictionaryDetails> {
	constructor() {
		super(data);
	}

	getTreeRoot(): Array<EntityTreeItem> {
		const rootItems = this.data.filter((item) => item.parentKey === null);
		return rootItems.map((item) => createEntityTreeItem(item));
	}

	/**
	 * No mapping as this mutates the data and removes the translation array
	 * DictionaryDetails derives from EntityTreeItem
	 * @param key
	 * @returns 
	 */
	getTreeItemChildren(key: string): Array<EntityTreeItem> {
		const childItems = this.data.filter((item) => item.parentKey === key);
		return childItems;
	}

	getTreeItem(keys: Array<string>): Array<EntityTreeItem> {
		const items = this.data.filter((item) => keys.includes(item.key ?? ''));
		return items.map((item) => createEntityTreeItem(item));
	}
}

export const umbDictionaryData = new UmbDictionaryData();
