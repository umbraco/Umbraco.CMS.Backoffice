import { UmbDocumentPublishingRepository } from '../repository/index.js';
import type { UmbDocumentDetailModel } from '../types.js';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UmbMergeContentVariantDataController } from '@umbraco-cms/backoffice/content';
import { jsonStringComparison } from '@umbraco-cms/backoffice/observable-api';

export class UmbPublishPendingChangesManager extends UmbControllerBase {
	#publishingRepository = new UmbDocumentPublishingRepository(this);

	async process({ unique, currentData }: { unique: string; currentData: UmbDocumentDetailModel }) {
		if (!unique) throw new Error('Unique is missing');
		if (!currentData) throw new Error('Current Data is missing');

		const { data: publishedData } = await this.#publishingRepository.published(unique);

		if (!publishedData) return;

		const variantIds = currentData.variants?.map((x) => UmbVariantId.Create(x)) ?? [];

		variantIds.forEach(async (variantId) => {
			const mergedData = await new UmbMergeContentVariantDataController(this).process(
				publishedData,
				currentData,
				[variantId],
				[variantId],
			);

			console.log('--------------');
			console.log('Variant', variantId.culture);
			console.log('Merged data', mergedData.values);
			console.log('Published data', publishedData.values);

			if (jsonStringComparison(mergedData.values, publishedData.values) === false) {
				console.log('This variant has changes', variantId.culture);
			}
		});
	}
}
