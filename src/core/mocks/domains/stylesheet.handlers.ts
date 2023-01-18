import { rest } from 'msw';
import { umbStylesheetData } from '../data/stylesheet.data';

// TODO: add schema
export const handlers = [
	rest.get('/umbraco/management/api/v1/stylesheet/details/:path', (req, res, ctx) => {
		const path = req.params.path as string;
		if (!path) return;
		const stylesheet = umbStylesheetData.getByPath(path);
		return res(ctx.status(200), ctx.json(stylesheet));
	}),

	rest.get('/umbraco/management/api/v1/tree/stylesheet/root', (req, res, ctx) => {
		const data = umbStylesheetData.getTreeRoot();
		return res(ctx.status(200), ctx.json(data));
	}),

	rest.get('/umbraco/management/api/v1/tree/stylesheet/children', (req, res, ctx) => {
		const path = req.url.searchParams.get('path');
		if (!path) return;
		const data = umbStylesheetData.getTreeItemChildren(path);
		return res(ctx.status(200), ctx.json(data));
	}),

	rest.get('/umbraco/management/api/v1/tree/stylesheet/item', (req, res, ctx) => {
		const paths = req.url.searchParams.getAll('path');
		if (!paths) return;
		const data = umbStylesheetData.getTreeItem(paths);
		return res(ctx.status(200), ctx.json(data));
	}),
];
