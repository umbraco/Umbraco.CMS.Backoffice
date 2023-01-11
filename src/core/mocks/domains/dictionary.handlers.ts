import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { umbDictionaryData } from '../data/dictionary.data';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { CreatedResult, DictionaryOverview } from '@umbraco-cms/backend-api';

// TODO: add schema
export const handlers = [
	rest.get('/umbraco/backoffice/dictionary/details/:key', (req, res, ctx) => {
		const key = req.params.key as string;
		if (!key) return;

		const dictionary = umbDictionaryData.getByKey(key);

		return res(ctx.status(200), ctx.json([dictionary]));
	}),

	rest.get('/umbraco/management/api/v1/dictionary', (req, res, ctx) => {
		const skip = req.url.searchParams.get('skip');
		const take = req.url.searchParams.get('take');
		if (!skip || !take) return;

		const dictionary = umbDictionaryData.getList(parseInt(skip), parseInt(take));

		// caller expects DictionaryOverview[] not DictionaryDetails[]
		const items: DictionaryOverview[] = dictionary.map((x) => {
			return {
				name: x.name,
				key: x.key,
				level: 0,
				translations: x.translations.map((t) => {
					return {
						displayName: t.displayName,
						hasTranslation: !!t.translation,
					};
				}),
			};
		});

		const response = {
			total: dictionary.length,
			items,
		};

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.post('/umbraco/management/api/v1/dictionary', async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		// data has name as key - saving should generate a unique key
		data.name = data.key;
		data.parentKey = data.parentId;
		data.key = uuidv4();

		const saved = umbDictionaryData.save([data])[0];
		saved.translations = [
			{
				displayName: 'English (United States)',
				isoCode: 'en-US',
				key: uuidv4(),
				languageId: 1,
				translation: 'hello in en-US',
			},
			{
				displayName: 'French',
				isoCode: 'fr',
				key: uuidv4(),
				languageId: 2,
				translation: '',
			},
		];

		const createdResult: CreatedResult = {
			value: saved,
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
		const rootItems = umbDictionaryData.getTreeRoot();
		const response = {
			total: rootItems.length,
			items: rootItems,
		};
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/dictionary/children', (req, res, ctx) => {
		const parentKey = req.url.searchParams.get('parentKey');
		if (!parentKey) return;

		const children = umbDictionaryData.getTreeItemChildren(parentKey);

		const response = {
			total: children.length,
			items: children,
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
];
