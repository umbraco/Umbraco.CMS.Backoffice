import { UmbRepositoryBase } from '../repository-base.js';
import { UmbDetailDataSource, UmbDetailDataSourceConstructor } from './detail-data-source.interface.js';
import { UmbDetailRepository } from './detail-repository.interface.js';
import { type UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbDetailStore } from '@umbraco-cms/backoffice/store';
import { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export abstract class UmbDetailRepositoryBase<
		DetailModelType extends { unique: string; entityType: string; parentUnique: string | null },
	>
	extends UmbRepositoryBase
	implements UmbDetailRepository<DetailModelType>, UmbApi
{
	#init: Promise<unknown>;

	#detailStore?: UmbDetailStore<DetailModelType>;
	#detailSource: UmbDetailDataSource<DetailModelType>;
	#notificationContext?: UmbNotificationContext;

	constructor(
		host: UmbControllerHost,
		detailSource: UmbDetailDataSourceConstructor<DetailModelType>,
		detailStoreContextAlias: string | UmbContextToken<any, any>,
	) {
		super(host);

		this.#detailSource = new detailSource(host);

		this.#init = Promise.all([
			this.consumeContext(detailStoreContextAlias, (instance) => {
				this.#detailStore = instance;
			}).asPromise(),

			this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
				this.#notificationContext = instance;
			}).asPromise(),
		]);
	}

	/**
	 * Creates a scaffold
	 * @param {(string | null)} parentUnique
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async createScaffold(parentUnique: string | null, preset?: Partial<DetailModelType>) {
		if (parentUnique === undefined) throw new Error('Parent unique is missing');
		return this.#detailSource.createScaffold(parentUnique, preset);
	}

	/**
	 * Requests the detail for the given unique
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async requestByUnique(unique: string) {
		if (!unique) throw new Error('Unique is missing');
		await this.#init;

		const { data, error } = await this.#detailSource.read(unique);

		if (data) {
			this.#detailStore!.append(data);
		}

		return { data, error, asObservable: () => this.#detailStore!.byUnique(unique) };
	}

	/**
	 * Returns a promise with an observable of the detail for the given unique
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async create(data: DetailModelType) {
		if (!data) throw new Error('Data is missing');
		await this.#init;

		const { data: createdData, error } = await this.#detailSource.create(data);

		if (createdData) {
			this.#detailStore?.append(createdData);

			// TODO: how do we handle generic notifications? Is this the correct place to do it?
			const notification = { data: { message: `Created` } };
			this.#notificationContext!.peek('positive', notification);
		}

		return { data: createdData, error };
	}

	/**
	 * Saves the given data
	 * @param {DetailModelType} data
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async save(data: DetailModelType) {
		if (!data) throw new Error('Data is missing');
		if (!data.unique) throw new Error('Unique is missing');
		await this.#init;

		const { data: updatedData, error } = await this.#detailSource.update(data);

		if (updatedData) {
			this.#detailStore!.updateItem(data.unique, updatedData);

			// TODO: how do we handle generic notifications? Is this the correct place to do it?
			const notification = { data: { message: `Saved` } };
			this.#notificationContext!.peek('positive', notification);
		}

		return { data, error };
	}

	/**
	 * Deletes the detail for the given unique
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async delete(unique: string) {
		if (!unique) throw new Error('Unique is missing');
		await this.#init;

		const { error } = await this.#detailSource.delete(unique);

		if (!error) {
			this.#detailStore!.removeItem(unique);

			// TODO: how do we handle generic notifications? Is this the correct place to do it?
			const notification = { data: { message: `Deleted` } };
			this.#notificationContext!.peek('positive', notification);
		}

		return { error };
	}

	/**
	 * Returns a promise with an observable of the detail for the given unique
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbDetailRepositoryBase
	 */
	async byUnique(unique: string) {
		if (!unique) throw new Error('Unique is missing');
		await this.#init;
		return this.#detailStore!.byUnique(unique);
	}
}
