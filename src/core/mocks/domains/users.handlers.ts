import { rest } from 'msw';

import { umbUsersData } from '../data/users.data';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

const slug = '/users';

export const handlers = [
	rest.get(umbracoPath(`${slug}`), (req, res, ctx) => {
		const response = umbUsersData.getAll();

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath(`${slug}/:id`), (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;
		const user = umbUsersData.getById(id);

		return res(ctx.status(200), ctx.json(user));
	}),

	rest.put(umbracoPath(`${slug}/:id`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		const saved = umbUsersData.save(data);

		return res(ctx.status(200), ctx.json(saved));
	}),
];
