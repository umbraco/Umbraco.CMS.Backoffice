import type { UmbWebhookDetailModel } from '../../types.js';
import { UMB_WEBHOOK_ENTITY_TYPE } from '../../entity.js';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type { UmbDetailDataSource } from '@umbraco-cms/backoffice/repository';
import type { CreateWebhookRequestModel, UpdateWebhookRequestModel } from '@umbraco-cms/backoffice/external/backend-api';
import { WebhookResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Webhook that fetches data from the server
 * @export
 * @class UmbWebhookServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbWebhookServerDataSource implements UmbDetailDataSource<UmbWebhookDetailModel> {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbWebhookServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbWebhookServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Creates a new Webhook scaffold
	 * @param {Partial<UmbWebhookDetailModel>} [preset]
	 * @return { CreateWebhookRequestModel }
	 * @memberof UmbWebhookServerDataSource
	 */
	async createScaffold(preset: Partial<UmbWebhookDetailModel> = {}) {
		const data: UmbWebhookDetailModel = {
			entityType: UMB_WEBHOOK_ENTITY_TYPE,
			enabled: true,
			url: '',
			events: [],
			types: [],
			name: '',
			unique: UmbId.new(),
			...preset,
		};

		return { data };
	}

	/**
	 * Fetches a Webhook with the given id from the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbWebhookServerDataSource
	 */
	async read(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			WebhookResource.getWebhookById({ id: unique }),
		);

		if (error || !data) {
			return { error };
		}

		// TODO: make data mapper to prevent errors
		const dataType: UmbWebhookDetailModel = {
			entityType: UMB_WEBHOOK_ENTITY_TYPE,
			enabled: data.enabled,
			url: data.url,
			events: [],
			types: [],
			name: '', //data.name,
			unique: data.id,
		};

		return { data: dataType };
	}

	/**
	 * Inserts a new Webhook on the server
	 * @param {UmbWebhookDetailModel} model
	 * @return {*}
	 * @memberof UmbWebhookServerDataSource
	 */
	async create(model: UmbWebhookDetailModel) {
		if (!model) throw new Error('Webhook is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: CreateWebhookRequestModel = {
			enabled: model.enabled,
			url: model.url,
			contentTypeKeys: [],
			events: [],
			headers: {},
			id: model.unique.toLowerCase(),
			//name: model.name,
		};

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			WebhookResource.postWebhook({
				requestBody,
			}),
		);

		if (data) {
			return this.read(data);
		}

		return { error };
	}

	/**
	 * Updates a Webhook on the server
	 * @param {UmbWebhookDetailModel} Webhook
	 * @return {*}
	 * @memberof UmbWebhookServerDataSource
	 */
	async update(model: UmbWebhookDetailModel) {
		if (!model.unique) throw new Error('Unique is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: UpdateWebhookRequestModel = {
			enabled: model.enabled,
			url: model.url,
			events: [],
			contentTypeKeys: [],
			headers: {},
			//name: model.name,
		};

		const { error } = await tryExecuteAndNotify(
			this.#host,
			WebhookResource.putWebhookById({
				id: model.unique.toLowerCase(),
				requestBody,
			}),
		);

		if (!error) {
			return this.read(model.unique);
		}

		return { error };
	}

	/**
	 * Deletes a Webhook on the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbWebhookServerDataSource
	 */
	async delete(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		return tryExecuteAndNotify(
			this.#host,
			WebhookResource.deleteWebhookById({
				id: unique,
			}),
		);
	}
}
