import { UmbId } from '@umbraco-cms/backoffice/id';
import {
	TemplateResponseModel,
	TemplateResource,
	CreateTemplateRequestModel,
	UpdateTemplateRequestModel,
} from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { UmbDataSource } from '@umbraco-cms/backoffice/repository';

/**
 * A data source for the Template detail that fetches data from the server
 * @export
 * @class UmbTemplateDetailServerDataSource
 * @implements {TemplateDetailDataSource}
 */
export class UmbTemplateDetailServerDataSource
	implements UmbDataSource<CreateTemplateRequestModel, any, UpdateTemplateRequestModel, TemplateResponseModel>
{
	#host: UmbControllerHostElement;

	/**
	 * Creates an instance of UmbTemplateDetailServerDataSource.
	 * @param {UmbControllerHostElement} host
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	constructor(host: UmbControllerHostElement) {
		this.#host = host;
	}

	/**
	 * Fetches a Template with the given id from the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	get(id: string) {
		return tryExecuteAndNotify(this.#host, TemplateResource.getTemplateById({ id }));
	}

	/**
	 * Creates a new Template scaffold
	 * @param {(string | null)} parentId
	 * @return {*}
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	async createScaffold() {
		const error = undefined;
		const data: TemplateResponseModel = {
			$type: '',
			id: UmbId.new(),
			name: '',
			alias: '',
			content: '',
		};

		// TODO: update when backend is updated so we don't have to do two calls
		/*
		// TODO: Revisit template models, masterTemplateAlias is not here anymore?
		const { data: scaffoldData, error: scaffoldError } = await tryExecuteAndNotify(
			this.#host,
			TemplateResource.getTemplateScaffold()
		);
		*/

		//error = scaffoldError;
		//data.content = scaffoldData?.content || '';

		return { data, error };
	}

	/**
	 * Inserts a new Template on the server
	 * @param {Template} template
	 * @return {*}
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	async insert(template: CreateTemplateRequestModel) {
		if (!template) throw new Error('Template is missing');

		return tryExecuteAndNotify(
			this.#host,
			tryExecuteAndNotify(this.#host, TemplateResource.postTemplate({ requestBody: template }))
		);
	}

	/**
	 * Updates a Template on the server
	 * @param {Template} template
	 * @return {*}
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	async update(id: string, template: UpdateTemplateRequestModel) {
		if (!id) throw new Error('Id is missing');
		if (!template) throw new Error('Template is missing');
		return tryExecuteAndNotify(this.#host, TemplateResource.putTemplateById({ id, requestBody: template }));
	}

	/**
	 * Deletes a Template on the server
	 * @param {string} id
	 * @return {*}
	 * @memberof UmbTemplateDetailServerDataSource
	 */
	async delete(id: string) {
		if (!id) throw new Error('Id is missing');
		return await tryExecuteAndNotify(this.#host, TemplateResource.deleteTemplateById({ id }));
	}
}
