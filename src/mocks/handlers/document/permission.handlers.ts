const { rest } = window.MockServiceWorker;
import { umbDocumentData } from '../../data/document.data.js';
import { UMB_SLUG } from './slug.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

// TODO: temp handlers until we have a real API
export const handlers = [
	rest.get(umbracoPath(`${UMB_SLUG}/:id/permissions`), (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;
		const response = umbDocumentData.getUserPermissionsForDocument(id);
		return res(ctx.status(200), ctx.json(response));
	}),
];
