import type { UmbMediaDetailModel } from '../../types.js';
import { UMB_MEDIA_ENTITY_TYPE } from '../../entity.js';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type { UmbDetailDataSource } from '@umbraco-cms/backoffice/repository';
import type { CreateMediaRequestModel, UpdateMediaRequestModel } from '@umbraco-cms/backoffice/external/backend-api';
import { MediaResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Media that fetches data from the server
 * @export
 * @class UmbMediaServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbMediaServerDataSource implements UmbDetailDataSource<UmbMediaDetailModel> {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbMediaServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMediaServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Creates a new Media scaffold
	 * @param {Partial<UmbMediaDetailModel>} [preset]
	 * @return { UmbMediaDetailModel }
	 * @memberof UmbMediaServerDataSource
	 */
	async createScaffold(preset: Partial<UmbMediaDetailModel> = {}) {
		const data: UmbMediaDetailModel = {
			entityType: UMB_MEDIA_ENTITY_TYPE,
			unique: UmbId.new(),
			urls: [],
			mediaType: {
				unique: '',
				collection: null,
			},
			isTrashed: false,
			values: [],
			variants: [
				{
					culture: null,
					segment: null,
					name: '',
					createDate: null,
					updateDate: null,
				},
			],
			...preset,
		};

		return { data };
	}

	/**
	 * Fetches a Media with the given id from the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbMediaServerDataSource
	 */
	async read(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const { data, error } = await tryExecuteAndNotify(this.#host, MediaResource.getMediaById({ id: unique }));

		if (error || !data) {
			return { error };
		}

		// TODO: make data mapper to prevent errors
		const media: UmbMediaDetailModel = {
			entityType: UMB_MEDIA_ENTITY_TYPE,
			unique: data.id,
			values: data.values as UmbMediaDetailModel['values'],
			variants: data.variants.map((variant) => {
				return {
					state: null,
					culture: variant.culture || null,
					segment: variant.segment || null,
					name: variant.name,
					createDate: variant.createDate,
					updateDate: variant.updateDate,
				};
			}),
			urls: data.urls as UmbMediaDetailModel['urls'],
			mediaType: {
				unique: data.mediaType.id,
				collection: data.mediaType.collection ? { unique: data.mediaType.collection.id } : null,
			},
			isTrashed: data.isTrashed,
		};

		return { data: media };
	}

	/**
	 * Inserts a new Media on the server
	 * @param {UmbMediaDetailModel} model
	 * @return {*}
	 * @memberof UmbMediaServerDataSource
	 */
	async create(model: UmbMediaDetailModel, parentUnique: string | null = null) {
		if (!model) throw new Error('Media is missing');
		if (!model.unique) throw new Error('Media unique is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: CreateMediaRequestModel = {
			id: model.unique,
			parent: parentUnique ? { id: parentUnique } : null,
			mediaType: { id: model.mediaType.unique },
			values: model.values,
			variants: model.variants.map((variant) => ({
				culture: variant.culture || null,
				segment: variant.segment || null,
				name: variant.name,
			})),
		};

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			MediaResource.postMedia({
				requestBody,
			}),
		);

		if (data) {
			return this.read(data);
		}

		return { error };
	}

	/**
	 * Updates a Media on the server
	 * @param {UmbMediaDetailModel} Media
	 * @return {*}
	 * @memberof UmbMediaServerDataSource
	 */
	async update(model: UmbMediaDetailModel) {
		if (!model.unique) throw new Error('Unique is missing');

		// TODO: make data mapper to prevent errors
		const requestBody: UpdateMediaRequestModel = {
			values: model.values,
			variants: model.variants,
		};

		const { error } = await tryExecuteAndNotify(
			this.#host,
			MediaResource.putMediaById({
				id: model.unique,
				requestBody,
			}),
		);

		if (!error) {
			return this.read(model.unique);
		}

		return { error };
	}

	/**
	 * Deletes a Media on the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbMediaServerDataSource
	 */
	async delete(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		// TODO: update to delete when implemented
		return tryExecuteAndNotify(this.#host, MediaResource.putMediaByIdMoveToRecycleBin({ id: unique }));
	}
}
