import type { UmbWebhookItemModel } from './types.js';
import { UmbItemServerDataSourceBase } from '@umbraco-cms/backoffice/repository';
import type { WebhookItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { WebhookResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * A server data source for Webhook items
 * @export
 * @class UmbWebhookItemServerDataSource
 * @implements {DocumentTreeDataSource}
 */
export class UmbWebhookItemServerDataSource extends UmbItemServerDataSourceBase<
	WebhookItemResponseModel,
	UmbWebhookItemModel
> {
	/**
	 * Creates an instance of UmbWebhookItemServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbWebhookItemServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		super(host, {
			getItems,
			mapper,
		});
	}
}

/* eslint-disable local-rules/no-direct-api-import */
const getItems = (uniques: Array<string>) => WebhookResource.getWebhookItem({ ids: uniques });

const mapper = (item: WebhookItemResponseModel): UmbWebhookItemModel => {
	return {
		unique: '', //item.id,
		name: item.name,
	};
};
