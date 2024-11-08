import type { UmbDocumentDetailModel } from '../types.js';
import { UmbDocumentPublishingRepository } from './repository/index.js';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UmbMergeContentVariantDataController } from '@umbraco-cms/backoffice/content';
import { jsonStringComparison, UmbArrayState } from '@umbraco-cms/backoffice/observable-api';

interface UmbPublishedPendingChangesManagerProcessArgs {
	unique: string;
	currentData: UmbDocumentDetailModel;
}

interface UmbVariantWithPendingChanges {
	variantId: UmbVariantId;
}

export class UmbPublishedPendingChangesManager extends UmbControllerBase {
	#variantsWithPendingChanges = new UmbArrayState<UmbVariantWithPendingChanges>([], (x) => x.variantId.toString());
	public readonly variantsWithPendingChanges = this.#variantsWithPendingChanges.asObservable();

	#publishingRepository = new UmbDocumentPublishingRepository(this);

	/**
	 * Checks each variant if there are any pending changes to publish.
	 * @param {UmbPublishedPendingChangesManagerProcessArgs} args - The arguments for the process.
	 * @param {string} args.unique - The unique identifier of the document.
	 * @param {UmbDocumentDetailModel} args.currentData - The current document data.
	 * @returns {Promise<void>}
	 * @memberof UmbPublishedPendingChangesManager
	 */
	async process(args: UmbPublishedPendingChangesManagerProcessArgs): Promise<void> {
		if (!args.unique) throw new Error('Unique is missing');
		if (!args.currentData) throw new Error('Current Data is missing');

		const { data: publishedData } = await this.#publishingRepository.published(args.unique);

		if (!publishedData) {
			this.#variantsWithPendingChanges.setValue([]);
			return;
		}

		const variantIds = args.currentData.variants?.map((x) => UmbVariantId.Create(x)) ?? [];

		const pendingChangesPromises = variantIds.map(async (variantId) => {
			const mergedData = await new UmbMergeContentVariantDataController(this).process(
				publishedData,
				args.currentData,
				[variantId],
				[variantId],
			);

			if (jsonStringComparison(mergedData, publishedData) === false) {
				return { variantId };
			} else {
				return null;
			}
		});

		const variantsWithPendingChanges = (await Promise.all(pendingChangesPromises)).filter((x) => x !== null);

		this.#variantsWithPendingChanges.setValue(variantsWithPendingChanges);
	}
}
