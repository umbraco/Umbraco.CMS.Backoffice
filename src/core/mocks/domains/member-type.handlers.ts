import { rest } from 'msw';
import { umbMemberTypeData } from '../data/member-type.data';

// TODO: add schema
export const handlers = [
	rest.get('/umbraco/management/api/v1/tree/member-type/root', (req, res, ctx) => {
		const response = umbMemberTypeData.getTreeRoot();
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/member-type/item', (req, res, ctx) => {
		const keys = req.url.searchParams.getAll('key');
		if (!keys) return;

		const items = umbMemberTypeData.getTreeItem(keys);

		return res(ctx.status(200), ctx.json(items));
	}),
];
