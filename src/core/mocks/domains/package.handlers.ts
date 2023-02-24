import { rest } from 'msw';

import { umbracoPath } from '@umbraco-cms/utils';
import type { PagedPackageMigrationStatusModel } from '@umbraco-cms/backend-api';

export const handlers = [
	rest.get(umbracoPath('/package/migration-status'), (_req, res, ctx) => {
		return res(
			// Respond with a 200 status code
			ctx.status(200),
			ctx.json<PagedPackageMigrationStatusModel>({
				total: 1,
				items: [
					{
						hasPendingMigrations: true,
						packageName: 'Named Package',
					},
					{
						hasPendingMigrations: true,
						packageName: 'My Custom Migration',
					},
					{
						hasPendingMigrations: false,
						packageName: 'Package with a view',
					},
				],
			})
		);
	}),
];
