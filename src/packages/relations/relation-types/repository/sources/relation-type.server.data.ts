import type {
	RelationTypeResponseModel,
	CreateRelationTypeRequestModel,
	UpdateRelationTypeRequestModel,
} from '@umbraco-cms/backoffice/external/backend-api';
import { RelationTypeResource, RelationResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { UmbId } from '@umbraco-cms/backoffice/id';

/**
 * A data source for the Relation Type that fetches data from the server
 * @export
 * @class UmbRelationTypeServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbRelationTypeServerDataSource {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbRelationTypeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbRelationTypeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches a Relation Type with the given id from the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async read(id: string) {
		if (!id) {
			throw new Error('Id is missing');
		}

		return tryExecuteAndNotify(
			this.#host,
			RelationTypeResource.getRelationTypeById({
				id,
			}),
		);
	}

	/**
	 * Fetches a Relation Type with the given id from the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async readRelations(id: string) {
		if (!id) {
			throw new Error('Id is missing');
		}

		return tryExecuteAndNotify(
			this.#host,
			RelationResource.getRelationTypeById({
				id,
			}),
		);
	}

	/**
	 * Creates a new Relation Type scaffold
	 * @param {(string | null)} parentId
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async createScaffold(parentId: string | null) {
		const data: RelationTypeResponseModel = {
			id: UmbId.new(),
			name: '',
			alias: '',
			isBidirectional: false,
			isDependency: false,
			path: '',
			isDeletable: false,
		};

		return { data };
	}

	/**
	 * Inserts a new Relation Type on the server
	 * @param {Document} relationType
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async create(relationType: CreateRelationTypeRequestModel) {
		if (!relationType.id) throw new Error('RelationType id is missing');

		return tryExecuteAndNotify(
			this.#host,
			RelationTypeResource.postRelationType({
				requestBody: relationType,
			}),
		);
	}

	/**
	 * Updates a RelationType on the server
	 * @param {RelationTypeResponseModel} relationType
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async update(id: string, relationType: UpdateRelationTypeRequestModel) {
		if (!id) throw new Error('RelationType id is missing');

		return tryExecuteAndNotify(
			this.#host,
			RelationTypeResource.putRelationTypeById({
				id,
				requestBody: relationType,
			}),
		);
	}

	/**
	 * Deletes a Relation Type on the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async delete(id: string) {
		if (!id) {
			throw new Error('RelationType id is missing');
		}

		return tryExecuteAndNotify(
			this.#host,
			RelationTypeResource.deleteRelationTypeById({
				id,
			}),
		);
	}
}
