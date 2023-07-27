const { rest } = window.MockServiceWorker;
import { umbDocumentTypeData } from '../data/document-type.data.js';
import type { DocumentTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

// TODO: add schema
export const handlers = [
	rest.post(umbracoPath(`/document-type`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		// TODO: This is something that is missing in the Full model, but which we need to for the tree model. This should be fixed in the Full model.
		data.parentId ??= null;

		const created = umbDocumentTypeData.insert(data);

		// TODO: remove this hack, as we get the right end-point, in that case we will be in control of the Ids. (I choose this URL to make it clear thats its a hack/mocked URL)
		return res(ctx.status(200), ctx.set({ location: '/header/location/id/' + created.id }));
	}),

	rest.put(umbracoPath(`/document-type/:id`), async (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;
		const data = await req.json();
		if (!data) return;

		const saved = umbDocumentTypeData.save(id, data);

		return res(ctx.status(200), ctx.json(saved));
	}),

	rest.get('/umbraco/management/api/v1/document-type/details/:id', (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;

		const document = umbDocumentTypeData.getById(id);

		return res(ctx.status(200), ctx.json([document]));
	}),

	rest.post<DocumentTypeResponseModel>('/umbraco/management/api/v1/document-type/details/save', (req, res, ctx) => {
		const data = req.body;
		if (!data) return;

		const saved = umbDocumentTypeData.save(data.id!, data);

		return res(ctx.status(200), ctx.json(saved));
	}),

	rest.get('/umbraco/management/api/v1/tree/document-type/root', (req, res, ctx) => {
		const rootItems = umbDocumentTypeData.getTreeRoot();
		const response = {
			total: rootItems.length,
			items: rootItems,
		};
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/document-type/children', (req, res, ctx) => {
		const parentId = req.url.searchParams.get('parentId');
		if (!parentId) return;

		const children = umbDocumentTypeData.getTreeItemChildren(parentId);

		const response = {
			total: children.length,
			items: children,
		};

		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get('/umbraco/management/api/v1/tree/document-type/item', (req, res, ctx) => {
		const ids = req.url.searchParams.getAll('id');
		if (!ids) return;

		const items = umbDocumentTypeData.getTreeItem(ids);

		return res(ctx.status(200), ctx.json(items));
	}),

	rest.get('/umbraco/management/api/v1/document-type/:id', (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;

		const documentType = umbDocumentTypeData.getById(id);

		return res(ctx.status(200), ctx.json(documentType));
	}),

	rest.get('/umbraco/management/api/v1/document-type/allowed-children-of/:id', (req, res, ctx) => {
		const id = req.params.id as string;
		if (!id) return;

		const items = umbDocumentTypeData.getAllowedTypesOf(id);

		return res(ctx.status(200), ctx.json(items));
	}),
];
