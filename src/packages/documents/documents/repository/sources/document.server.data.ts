import { UmbId } from '@umbraco-cms/backoffice/id';
import type { UmbDataSource } from '@umbraco-cms/backoffice/repository';
import {
	DocumentResource,
	DocumentResponseModel,
	ContentStateModel,
	CreateDocumentRequestModel,
	UpdateDocumentRequestModel,
	PublishDocumentRequestModel,
	UnpublishDocumentRequestModel,
} from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';

/**
 * A data source for the Document that fetches data from the server
 * @export
 * @class UmbDocumentServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbDocumentServerDataSource
	implements UmbDataSource<CreateDocumentRequestModel, any, UpdateDocumentRequestModel, DocumentResponseModel>
{
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbDocumentServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbDocumentServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches a Document with the given id from the server
	 * @param {string} id
	 * @memberof UmbDocumentServerDataSource
	 */
	async read(id: string) {
		if (!id) throw new Error('Id is missing');

		return tryExecuteAndNotify(
			this.#host,
			DocumentResource.getDocumentById({
				id,
			}),
		);
	}

	/**
	 * Creates a new Document scaffold
	 * @param {string} documentTypeId
	 * @param {Partial<CreateDocumentRequestModel>} [preset]
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
	 * @memberof UmbDocumentServerDataSource
	 */
	async create(document: CreateDocumentRequestModel) {
		if (!document.id) throw new Error('Id is missing');
		return tryExecuteAndNotify(this.#host, DocumentResource.postDocument({ requestBody: document }));
	}

	/**
	 * Updates a Document on the server
	 * @param {string} id
	 * @param {UpdateDocumentRequestModel} document
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async update(id: string, document: UpdateDocumentRequestModel) {
		if (!id) throw new Error('Id is missing');

		/* TODO: look into why typescript doesn't complain about getting another model than UpdateDocumentRequestModel
		Maybe we should simplify the sources, and always send the biggest model.
		Then it is up to the data source to format the data correctly before passing it to wherever */
		const requestBody: UpdateDocumentRequestModel = {
			templateId: document.templateId,
			values: document.values,
			variants: document.variants?.map((variant) => ({
				culture: variant.culture,
				segment: variant.segment,
				name: variant.name,
			})),
		};

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentById({ id, requestBody }));
	}


	/**
	 * Publish one or more variants of a Document
	 * @param {string} id
	 * @param {Array<UmbVariantId>} variantIds
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async saveAndPublish(id: string, variantIds: Array<UmbVariantId>) {
		if (!id) throw new Error('Id is missing');

		// TODO: THIS DOES NOT TAKE SEGMENTS INTO ACCOUNT!!!!!!
		const requestBody: PublishDocumentRequestModel = {
			cultures: variantIds.map((variant) => variant.toCultureString()),
		};

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdPublish({ id, requestBody }));
	}

	/**
	 * Unpublish one or more variants of a Document
	 * @param {string} id
	 * @param {Array<UmbVariantId>} variantIds
	 * @return {*}
	 * @memberof UmbDocumentServerDataSource
	 */
	async unpublish(id: string, variantIds: Array<UmbVariantId>) {
		if (!id) throw new Error('Id is missing');

		// TODO: THIS DOES NOT TAKE SEGMENTS INTO ACCOUNT!!!!!!
		const requestBody: UnpublishDocumentRequestModel = {
			culture: variantIds.map((variant) => variant.toCultureString())[0],
		};

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdUnpublish({ id, requestBody }));
	}

	/**
	 * Moves a Document to the recycle bin on the server
	 * @param {string} id
	 * @memberof UmbDocumentServerDataSource
	 */
	async trash(id: string) {
		if (!id) throw new Error('Document ID is missing');
		// TODO: if we get a trash endpoint, we should use that instead.
		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdMoveToRecycleBin({ id }));
	}

	/**
	 * Deletes a Document on the server
	 * @param {string} id
	 * @memberof UmbDocumentServerDataSource
	 */
	async delete(id: string) {
		if (!id) throw new Error('Document ID is missing');
		return this.trash(id);
	}

	/**
	 * Get the allowed document types for a given parent id
	 * @param {string} id
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
