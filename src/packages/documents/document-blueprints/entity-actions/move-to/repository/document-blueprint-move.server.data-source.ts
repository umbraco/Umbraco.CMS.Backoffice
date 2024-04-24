import { DocumentBlueprintService } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { UmbMoveDataSource, UmbMoveToRequestArgs } from '@umbraco-cms/backoffice/entity-action';

/**
 * Move DocumentBlueprint Server Data Source
 * @export
 * @class UmbMoveDocumentBlueprintServerDataSource
 */
export class UmbMoveDocumentBlueprintServerDataSource implements UmbMoveDataSource {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbMoveDocumentBlueprintServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbMoveDocumentBlueprintServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Move an item for the given id to the target unique
	 * @param {string} unique
	 * @param {(string | null)} targetUnique
	 * @return {*}
	 * @memberof UmbMoveDocumentBlueprintServerDataSource
	 */
	async moveTo(args: UmbMoveToRequestArgs) {
		if (!args.unique) throw new Error('Unique is missing');
		if (args.destination.unique === undefined) throw new Error('Destination unique is missing');

		return tryExecuteAndNotify(
			this.#host,
			DocumentBlueprintService.putDocumentBlueprintByIdMove({
				id: args.unique,
				requestBody: {
					target: args.destination.unique ? { id: args.destination.unique } : null,
				},
			}),
		);
	}
}
