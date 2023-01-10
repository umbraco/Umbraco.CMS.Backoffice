import { response, rest } from 'msw';
import { umbDictionaryData } from '../data/dictionary.data';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { DictionaryOverview } from '@umbraco-cms/backend-api';

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
		const items: DictionaryOverview[] = dictionary.map(x => {
			return {
				name: x.name,
				key: x.key,
				level: 0,
				translations: x.translations.map(t => {
					return {
						displayName: t.displayName,
						hasTranslation: !!t.translation,
					}
				}),				
			}
		})

		const response = {
			total: dictionary.length,
			items,
		};

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.post<DictionaryDetails>('/umbraco/backoffice/dictionary/save', async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		const saved = umbDictionaryData.save(data);

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
];
