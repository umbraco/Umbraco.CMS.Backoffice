import type { UmbImagingModel } from './types.js';
import { ImagingService, type MediaUrlInfoResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbMediaUrlModel } from '@umbraco-cms/backoffice/media';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Imaging Service that resizes a media item from the server
 * @export
 * @class UmbImagingServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbImagingServerDataSource {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbImagingServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbImagingServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches the URL for the given media items as resized images
	 * @param {string} unique
	 * @memberof UmbImagingServerDataSource
	 */
	async getItems(uniques: Array<string>, imagingModel?: UmbImagingModel) {
		if (!uniques.length) throw new Error('Uniques are missing');

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			ImagingService.getImagingResizeUrls({ id: uniques, ...imagingModel }),
		);

		if (data) {
			const items = data.map((item) => this.#mapper(item));
			return { data: items };
		}

		return { error };
	}

	#mapper(item: MediaUrlInfoResponseModel): UmbMediaUrlModel {
		const url = item.urlInfos[0]?.url;
		return {
			unique: item.id,
			url: url,
		};
	}
}
