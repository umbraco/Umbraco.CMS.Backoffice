import type { UmbDocumentVariantPublishModel } from '../../types.js';
import type {
	CultureAndScheduleRequestModel,
	PublishDocumentRequestModel,
	PublishDocumentWithDescendantsRequestModel,
	UnpublishDocumentRequestModel,
} from '@umbraco-cms/backoffice/external/backend-api';
import { DocumentResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';

/**
 * A server data source for Document publishing
 * @export
 * @class UmbDocumentPublishingServerDataSource
 * @implements {DocumentTreeDataSource}
 */
export class UmbDocumentPublishingServerDataSource {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbDocumentPublishingServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbDocumentPublishingServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Publish one or more variants of a Document
	 * @param {string} unique
	 * @param {Array<UmbVariantId>} variantIds
	 * @return {*}
	 * @memberof UmbDocumentPublishingServerDataSource
	 */
	async publish(unique: string, variants: Array<UmbDocumentVariantPublishModel>) {
		if (!unique) throw new Error('Id is missing');

		const publishSchedules: CultureAndScheduleRequestModel[] = variants.map<CultureAndScheduleRequestModel>(
			(variant) => {
				return {
					culture: variant.variantId.isCultureInvariant() ? null : variant.variantId.toCultureString(),
					schedule: variant.schedule,
				};
			},
		);

		// TODO: THIS DOES NOT TAKE SEGMENTS INTO ACCOUNT!!!!!!
		const requestBody: PublishDocumentRequestModel = {
			publishSchedules,
		};

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdPublish({ id: unique, requestBody }));
	}

	/**
	 * Unpublish one or more variants of a Document
	 * @param {string} unique
	 * @param {Array<UmbVariantId>} variantIds
	 * @return {*}
	 * @memberof UmbDocumentPublishingServerDataSource
	 */
	async unpublish(unique: string, variantIds: Array<UmbVariantId>) {
		if (!unique) throw new Error('Id is missing');

		// TODO: THIS DOES NOT TAKE SEGMENTS INTO ACCOUNT!!!!!!

		// If variants are culture invariant, we need to pass null to the API
		const hasInvariant = variantIds.some((variant) => variant.isCultureInvariant());

		if (hasInvariant) {
			const requestBody: UnpublishDocumentRequestModel = {
				cultures: null,
			};

			return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdUnpublish({ id: unique, requestBody }));
		}

		const requestBody: UnpublishDocumentRequestModel = {
			cultures: variantIds.map((variant) => variant.toCultureString()),
		};

		return tryExecuteAndNotify(this.#host, DocumentResource.putDocumentByIdUnpublish({ id: unique, requestBody }));
	}

	/**
	 * Publish variants of a document and all its descendants
	 * @memberof UmbDocumentPublishingServerDataSource
	 */
	async publishWithDescendants(
		unique: string,
		variantIds: Array<UmbVariantId>,
		includeUnpublishedDescendants: boolean,
	) {
		if (!unique) throw new Error('Id is missing');

		const requestBody: PublishDocumentWithDescendantsRequestModel = {
			cultures: variantIds.map((variant) => variant.toCultureString()),
			includeUnpublishedDescendants,
		};

		return tryExecuteAndNotify(
			this.#host,
			DocumentResource.putDocumentByIdPublishWithDescendants({ id: unique, requestBody }),
		);
	}
}
