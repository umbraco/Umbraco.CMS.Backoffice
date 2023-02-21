import { rest } from 'msw';
import { umbTemplateData } from '../data/template.data';
import { umbracoPath } from '@umbraco-cms/utils';
import { TemplateCreateModel, TemplateUpdateModel } from '@umbraco-cms/backend-api';

// TODO: add schema
export const handlers = [
	rest.get(umbracoPath('/tree/template/root'), (req, res, ctx) => {
		const response = umbTemplateData.getTreeRoot();
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/tree/template/children'), (req, res, ctx) => {
		const parentKey = req.url.searchParams.get('parentKey');
		if (!parentKey) return;

		const response = umbTemplateData.getTreeItemChildren(parentKey);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/tree/template/item'), (req, res, ctx) => {
		const keys = req.url.searchParams.getAll('key');
		if (!keys) return;

		const items = umbTemplateData.getTreeItem(keys);
		return res(ctx.status(200), ctx.json(items));
	}),

	rest.get(umbracoPath('/template/scaffold'), (req, res, ctx) => {
		const masterTemplateAlias = req.url.searchParams.get('masterTemplateAlias');
		if (!masterTemplateAlias) return;

		const response = umbTemplateData.getScaffold(masterTemplateAlias);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath('/template/:key'), (req, res, ctx) => {
		const key = req.params.key as string;
		if (!key) return;

		const response = umbTemplateData.getByKey(key);
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.put<TemplateUpdateModel>(umbracoPath('/template/:key'), async (req, res, ctx) => {
		const key = req.params.key as string;
		const data = await req.json();
		if (!key) return;

		umbTemplateData.update(data);
		return res(ctx.status(200));
	}),

	rest.post<TemplateCreateModel>(umbracoPath('/template'), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		const created = umbTemplateData.create(data);
		return res(ctx.status(200), ctx.json(created));
	}),
];
