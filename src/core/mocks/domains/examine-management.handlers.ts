import { rest } from 'msw';
import { searchResultMockData, getIndexByName, PagedIndexers } from '../data/examine.data';

import { umbracoPath } from '@umbraco-cms/utils';
import { IndexModel, PagedIndexModel, PagedSearcherModel, PagedSearchResultModel } from '@umbraco-cms/backend-api';

export const handlers = [
	rest.get(umbracoPath('/indexer'), (_req, res, ctx) => {
		return res(
			// Respond with a 200 status code
			ctx.status(200),
			ctx.json<PagedIndexModel>(PagedIndexers)
		);
	}),

	rest.get(umbracoPath('/indexer/:indexName'), (_req, res, ctx) => {
		const indexName = _req.params.indexName as string;

		if (!indexName) return;
		const indexFound = getIndexByName(indexName);

		if (indexFound) {
			return res(ctx.status(200), ctx.json<IndexModel>(indexFound));
		} else {
			return res(ctx.status(404));
		}
	}),

	rest.post(umbracoPath('/indexer/:indexName/rebuild'), async (_req, res, ctx) => {
		await new Promise((resolve) => setTimeout(resolve, (Math.random() + 1) * 1000)); // simulate a delay of 1-2 seconds

		const indexName = _req.params.indexName as string;
		if (!indexName) return;

		const indexFound = getIndexByName(indexName);
		if (indexFound) {
			return res(ctx.status(201));
		} else {
			return res(ctx.status(404));
		}
	}),

	rest.get(umbracoPath('/searcher'), (_req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json<PagedSearcherModel>({
				total: 0,
				items: [{ name: 'ExternalSearcher' }, { name: 'InternalSearcher' }, { name: 'InternalMemberSearcher' }],
			})
		);
	}),

	rest.get(umbracoPath('/searcher/:searcherName/query'), (_req, res, ctx) => {
		const query = _req.url.searchParams.get('term');
		const take = _req.url.searchParams.get('take');

		const searcherName = _req.params.searcherName as string;

		if (!searcherName || !query) return;

		if (searcherName) {
			return res(
				ctx.status(200),
				ctx.json<PagedSearchResultModel>({
					total: 0,
					items: searchResultMockData,
				})
			);
		} else {
			return res(ctx.status(404));
		}
	}),
];
