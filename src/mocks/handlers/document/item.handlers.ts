const { rest } = window.MockServiceWorker;
import { umbDocumentData } from '../../data/document.data.js';
import { UMB_SLUG } from './slug.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

export const handlers = [
	rest.get(umbracoPath(`${UMB_SLUG}/item`), (req, res, ctx) => {
		const ids = req.url.searchParams.getAll('id');
		if (!ids) return;
		const items = umbDocumentData.getItems(ids);
		return res(ctx.status(200), ctx.json(items));
	}),
];
