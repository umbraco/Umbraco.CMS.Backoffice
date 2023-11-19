const { rest } = window.MockServiceWorker;
import { umbDataTypeData } from '../../data/data-type.data.js';
import { UMB_SLUG } from './slug.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';
import { ProblemDetails } from '@umbraco-cms/backoffice/backend-api';

export const folderHandlers = [
	rest.post(umbracoPath(`${UMB_SLUG}/folder`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		umbDataTypeData.createFolder(data);

		return res(ctx.status(200));
	}),

	rest.get(umbracoPath(`${UMB_SLUG}/folder/:id`), (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;

		const dataType = umbDataTypeData.getById(id);

		return res(ctx.status(200), ctx.json(dataType));
	}),

	rest.put(umbracoPath(`${UMB_SLUG}/folder/:id`), async (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;
		const data = await req.json();
		if (!data) return;

		umbDataTypeData.save(id, data);

		return res(ctx.status(200));
	}),

	rest.delete(umbracoPath(`${UMB_SLUG}/folder/:id`), async (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;

		try {
			umbDataTypeData.deleteFolder(id);
			return res(ctx.status(200));
		} catch (error) {
			return res(
				ctx.status(404),
				ctx.json<ProblemDetails>({
					status: 404,
					type: 'error',
					detail: 'Not Found',
				}),
			);
		}
	}),
];
