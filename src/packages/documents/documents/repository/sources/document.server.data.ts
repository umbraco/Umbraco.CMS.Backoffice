import { UmbId } from '@umbraco-cms/backoffice/id';
import type { UmbDataSource } from '@umbraco-cms/backoffice/repository';
import {
	DocumentResource,
	DocumentResponseModel,
	ContentStateModel,
	CreateDocumentRequestModel,
	UpdateDocumentRequestModel,
} from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Document that fetches data from the server
 * @export
 * @class UmbDocumentServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbDocumentServerDataSource
	implements UmbDataSource<CreateDocumentRequestModel, any, UpdateDocumentRequestModel, DocumentResponseModel>
{
	#host: UmbControllerHostElement;

	/**
	 * Creates an instance of UmbDocumentServerDataSource.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbDocumentServerDataSource
	 */
	constructor(host: UmbControllerHostElement) {
		this.#host = host;
	}

	/**
	 * Fetches a Document with the given id from the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async get(id: string) {
		if (!id) {
			throw new Error('Id is missing');
		}

		return tryExecuteAndNotify(
			this.#host,
			DocumentResource.getDocumentById({
				id,
			}),
		);
	}

	/**
	 * Creates a new Document scaffold
	 * @param {(string | null)} parentId
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async createScaffold(documentTypeId: string, preset?: Partial<CreateDocumentRequestModel>) {
		const data: DocumentResponseModel = {
			urls: [],
			templateId: null,
			parentId: null,
			contentTypeId: documentTypeId,
			values: [],
			variants: [
				{
					state: ContentStateModel.DRAFT,
					publishDate: null,
					culture: null,
					segment: null,
					name: '',
					createDate: new Date().toISOString(),
					updateDate: undefined,
				},
			],
			...preset,
			id: UmbId.new(),
		};

		return { data };
	}

	/**
	 * Inserts a new Document on the server
	 * @param {Document} document
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async insert(document: CreateDocumentRequestModel & { id: string }) {
		if (!document.id) throw new Error('Id is missing');

		// TODO: Hack to remove some props that ruins the document-type post end-point.
		const unFroozenDocument = { ...document };
		(unFroozenDocument as any).id = undefined;

		(unFroozenDocument.variants as any) =
			unFroozenDocument.variants?.map((variant) => {
				return { ...variant };
			}) ?? [];

		return tryExecuteAndNotify(this.#host, DocumentResource.postDocument({ requestBody: unFroozenDocument }));
	}

	/**
	 * Updates a Document on the server
	 * @param {Document} Document
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async update(id: string, document: UpdateDocumentRequestModel) {
		if (!id) throw new Error('Id is missing');

		// TODO: Hack to remove some props that ruins the document-type post end-point.
		const unFroozenDocument = { ...document };
		(unFroozenDocument as any).id = undefined;

		(unFroozenDocument.variants as any) =
			unFroozenDocument.variants?.map((variant) => {
				return { ...variant };
			}) ?? [];

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentById({ id, requestBody: unFroozenDocument }));
	}

	/**
	 * Trash a Document on the server
	 * @param {Document} Document
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async trash(id: string) {
		if (!id) {
			throw new Error('Id is missing');
		}

		// TODO: use resources when end point is ready:
		return tryExecuteAndNotify<DocumentResponseModel>(
			this.#host,
			fetch('/umbraco/management/api/v1/document/trash', {
				method: 'POST',
				body: JSON.stringify([id]),
				headers: {
					'Content-Type': 'application/json',
				},
			}) as any,
		);
	}

	/**
	 * Deletes a Document on the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async delete(id: string) {
		if (!id) {
			throw new Error('Id is missing');
		}

		return tryExecuteAndNotify(
			this.#host,
			fetch('/umbraco/management/api/v1/document/trash', {
				method: 'POST',
				body: JSON.stringify([id]),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((res) => res.json()),
		);
	}

	/**
	 * Get the allowed document types for a given parent id
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbDocumentTypeServerDataSource
	 */
	async getAllowedDocumentTypesOf(id: string | null) {
		if (id === undefined) throw new Error('Id is missing');
		// TODO: remove when null is allowed as id.
		const hackId = id === null ? undefined : id;
		// TODO: Notice, here we need to implement pagination.
		return tryExecuteAndNotify(this.#host, DocumentResource.getDocumentAllowedDocumentTypes({ parentId: hackId }));
	}
}
