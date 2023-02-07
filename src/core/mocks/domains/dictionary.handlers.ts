import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { umbDictionaryData } from '../data/dictionary.data';
import { ContentResult, CreatedResult, DictionaryImport, DictionaryOverview } from '@umbraco-cms/backend-api';
import type { DictionaryDetails } from '@umbraco-cms/models';

const uploadResponse: DictionaryImport = {
	tempFileName: 'c:/path/to/tempfilename.udt',
	dictionaryItems: [{
		name: 'Uploaded dictionary',
	}]
};

///
const importResponse: DictionaryDetails = {
	parentKey: null,
	name: 'Uploaded dictionary',
	key: 'b7e7d0ab-53ba-485d-dddd-12537f9925cb',
	hasChildren: false,
	type: 'dictionary',
	isContainer: false,
	icon: 'umb:book-alt',
	translations: [{
		displayName: 'English (United States)',
		isoCode: 'en',
		key: '37e7d0ab-53ba-425d-b8bd-12537f9925ca',
		languageId: 1,
		translation: 'I am an imported US value'
	},
	{
		displayName: 'French',
		isoCode: 'fr',
		key: 'b4e7d0ab-53ba-485d-b8bd-12537f9925cd',
		languageId: 2,
		translation: 'I am an imported French value',
	}],
};


// alternate data for dashboard view
const overviewData: Array<DictionaryOverview> = [
	{
		name: 'Hello',
		key: 'aae7d0ab-53ba-485d-b8bd-12537f9925cb',
		level: 1,
		translatedIsoCodes: ['en', 'fr'],
	},
	{
		name: 'Hello again',
		key: 'bbe7d0ab-53bb-485d-b8bd-12537f9925cb',
		level: 2,
		translatedIsoCodes: ['en'],
	},
];

// TODO: add schema
export const handlers = [
	rest.get('/umbraco/management/api/v1/dictionary/:key', (req, res, ctx) => {
		const key = req.params.key as string;
		if (!key) return;

		const dictionary = umbDictionaryData.getByKey(key);
		return res(ctx.status(200), ctx.json(dictionary));
	}),

	rest.get('/umbraco/management/api/v1/dictionary', (req, res, ctx) => {
		const skip = req.url.searchParams.get('skip');
		const take = req.url.searchParams.get('take');
		if (!skip || !take) return;

		// overview is DictionaryOverview[], umbDictionaryData provides DictionaryDetails[]
		// which are incompatible types to mock, so we can do a filthy replacement here
		//const items = umbDictionaryData.getList(parseInt(skip), parseInt(take));
		const items = overviewData;

		const response = {
			total: items.length,
			items,
		};

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.post('/umbraco/management/api/v1/dictionary', async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		data.parentKey = data.parentId;
		data.icon = 'umb:book-alt';
		data.hasChildren = false;
		data.type = 'dictionary';
		data.translations = [
			{
				displayName: 'English (United States)',
				isoCode: 'en-US',
				key: uuidv4(),
				languageId: 1,
				translation: '',
			},
			{
				displayName: 'French',
				isoCode: 'fr',
				key: uuidv4(),
				languageId: 2,
				translation: '',
			},
		];

		const value = umbDictionaryData.save([data])[0];

		const createdResult: CreatedResult = {
			value,
			statusCode: 200,
		};

		return res(ctx.status(200), ctx.json(createdResult));
	}),

	rest.patch('/umbraco/management/api/v1/dictionary/:key', async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		const key = req.params.key as string;
		if (!key) return;

		const dataToSave = JSON.parse(data[0].value);
		const saved = umbDictionaryData.save([dataToSave]);

		return res(ctx.status(200), ctx.json(saved));
	}),

	rest.get('/umbraco/management/api/v1/tree/dictionary/root', (req, res, ctx) => {
		const items = umbDictionaryData.getTreeRoot();
		const response = {
			total: items.length,
			items,
		};
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/dictionary/children', (req, res, ctx) => {
		const parentKey = req.url.searchParams.get('parentKey');
		if (!parentKey) return;

		const items = umbDictionaryData.getTreeItemChildren(parentKey);

		const response = {
			total: items.length,
			items,
		};

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/dictionary/item', (req, res, ctx) => {
		const keys = req.url.searchParams.getAll('key');
		if (!keys) return;

		const items = umbDictionaryData.getTreeItem(keys);

		return res(ctx.status(200), ctx.json(items));
	}),

	rest.delete('/umbraco/management/api/v1/dictionary/:key', (req, res, ctx) => {
		const key = req.params.key as string;
		if (!key) return;

		const deletedKeys = umbDictionaryData.delete([key]);

		return res(ctx.status(200), ctx.json(deletedKeys));
	}),

	// TODO => handle properly, querystring breaks handler
	rest.get('/umbraco/management/api/v1/dictionary/export/:key', (req, res, ctx) => {
		const key = req.params.key as string;
		if (!key) return;

		const includeChildren = req.url.searchParams.get('includeChildren');
		const item = umbDictionaryData.getByKey(key);

		alert(`Downloads file for dictionary "${item?.name}", ${includeChildren === 'true' ? 'with' : 'without'} children.`)
		return res(ctx.status(200));
	}),
	
	rest.post('/umbraco/management/api/v1/dictionary/upload', async (req, res, ctx) => {
		if (!req.arrayBuffer()) return;

		return res(ctx.status(200), ctx.json(uploadResponse));
	}),

	rest.post('/umbraco/management/api/v1/dictionary/import', async (req, res, ctx) => {
		const file = req.url.searchParams.get('file');

		if (!file) return;

		importResponse.parentKey = req.url.searchParams.get('parentId') ?? null;
		umbDictionaryData.save([importResponse]);

		// build the path to the new item => reflects the expected server response
		const path = ['-1'];
		if (importResponse.parentKey) path.push(importResponse.parentKey);

		path.push(importResponse.key);

		const contentResult: ContentResult = {
			content: path.join(','),
			statusCode: 200,
		};

		return res(ctx.status(200), ctx.json(contentResult));
	}),
];
