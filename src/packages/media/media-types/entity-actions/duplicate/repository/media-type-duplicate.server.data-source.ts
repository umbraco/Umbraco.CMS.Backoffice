import { MediaTypeService } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { UmbDuplicateToDataSource, UmbDuplicateToRequestArgs } from '@umbraco-cms/backoffice/entity-action';

/**
 * Duplicate Document Server Data Source
 * @export
 * @class UmbDuplicateMediaTypeServerDataSource
 */
export class UmbDuplicateMediaTypeServerDataSource implements UmbDuplicateToDataSource {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbDuplicateMediaTypeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbDuplicateMediaTypeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Duplicate an item for the given unique to the destination unique
	 * @param {UmbDuplicateToRequestArgs} args
	 * @return {*}
	 * @memberof UmbDuplicateMediaTypeServerDataSource
	 */
	async duplicateTo(args: UmbDuplicateToRequestArgs) {
		if (!args.unique) throw new Error('Unique is missing');
		if (args.destination.unique === undefined) throw new Error('Destination unique is missing');

		return tryExecuteAndNotify(
			this.#host,
			MediaTypeService.postMediaTypeByIdCopy({
				id: args.unique,
				requestBody: {
					target: args.destination.unique ? { id: args.destination.unique } : null,
				},
			}),
		);
	}
}
