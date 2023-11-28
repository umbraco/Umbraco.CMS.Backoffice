const { rest } = window.MockServiceWorker;
import { umbUsersData } from '../../data/user/user.db.js';
import { UMB_SLUG } from './slug.js';
import { InviteUserRequestModel } from '@umbraco-cms/backoffice/backend-api';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

const inviteSlug = `${UMB_SLUG}/invite`;

export const handlers = [
	rest.post<InviteUserRequestModel>(umbracoPath(`${inviteSlug}`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		const { userId } = umbUsersData.invite(data);

		if (!userId) return res(ctx.status(400));

		return res(ctx.status(201), ctx.set('Location', userId));
	}),

	rest.post<any>(umbracoPath(`${inviteSlug}/resend`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		return res(ctx.status(200));
	}),
];
