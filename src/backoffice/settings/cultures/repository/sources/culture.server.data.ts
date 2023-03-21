import { UmbCultureDataSource } from '.';
import { CultureResource } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Language that fetches data from the server
 * @export
 * @class UmbLanguageServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbCultureServerDataSource implements UmbCultureDataSource {
	#host: UmbControllerHostInterface;

	/**
	 * Creates an instance of UmbLanguageServerDataSource.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbLanguageServerDataSource
	 */
	constructor(host: UmbControllerHostInterface) {
		this.#host = host;
	}

	/**
	 * Get a list of cultures on the server
	 * @return {*}
	 * @memberof UmbLanguageServerDataSource
	 */
	async getCollection({ skip, take }: { skip: number; take: number }) {
		return tryExecuteAndNotify(this.#host, CultureResource.getCulture({ skip, take }));
	}
}
