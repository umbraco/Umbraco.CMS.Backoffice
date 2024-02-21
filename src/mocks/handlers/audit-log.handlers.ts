import { logs, logsWithUser } from '../data/audit-log.data.js';
const { rest } = window.MockServiceWorker;
import { umbracoPath } from '@umbraco-cms/backoffice/utils';
import type {
	PagedAuditLogResponseModel,
	PagedAuditLogWithUsernameResponseModel,
} from '@umbraco-cms/backoffice/external/backend-api';

export const handlers = [
	rest.get(umbracoPath('/audit-log'), (_req, res, ctx) => {
		const PagedAuditLog = {
			total: logsWithUser.length,
			items: logsWithUser,
		};
		return res(ctx.status(200), ctx.json<PagedAuditLogWithUsernameResponseModel>(PagedAuditLog));
	}),
	rest.get(umbracoPath('/audit-log/:id'), (_req, res, ctx) => {
		const id = _req.params.id as string;
		if (!id) return;

		const foundLogs = logs.filter((log) => log.entity?.id === id);
		const PagedAuditLog = {
			total: foundLogs.length,
			items: foundLogs,
		};

		return res(ctx.status(200), ctx.json<PagedAuditLogResponseModel>(PagedAuditLog));
	}),
	rest.get(umbracoPath('/audit-log/type/:logType'), (_req, res, ctx) => {
		const logType = _req.params.logType as string;
		if (!logType) return;

		const foundLogs = logs.filter((log) => log.entity?.type === logType);
		const PagedAuditLog = {
			total: foundLogs.length,
			items: foundLogs,
		};

		return res(ctx.status(200), ctx.json<PagedAuditLogResponseModel>(PagedAuditLog));
	}),
];
