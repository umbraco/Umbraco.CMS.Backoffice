import type { UmbLanguageCollectionFilterModel } from '../types.js';
import { UMB_LANGUAGE_ROOT_ENTITY_TYPE } from '../../entity.js';
import { UmbLanguageCollectionServerDataSource } from './language-collection.server.data-source.js';
import type { UmbLanguageCollectionDataSource } from './types.js';
import { UmbRepositoryBase } from '@umbraco-cms/backoffice/repository';
import type { UmbCollectionRepository } from '@umbraco-cms/backoffice/collection';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbLanguageCollectionRepository extends UmbRepositoryBase implements UmbCollectionRepository {
	#collectionSource: UmbLanguageCollectionDataSource;

	constructor(host: UmbControllerHost) {
		super(host);
		this.#collectionSource = new UmbLanguageCollectionServerDataSource(host);
	}

	async requestCollection(filter: UmbLanguageCollectionFilterModel) {
		return this.#collectionSource.getCollection(filter);
	}

	async requestRoot() {
		//const { data: treeRootData } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
		//const hasChildren = treeRootData ? treeRootData.total > 0 : false;

		const data = {
			unique: null,
			entityType: UMB_LANGUAGE_ROOT_ENTITY_TYPE,
			name: '#treeHeaders_languages',
			hasChildren: true,
		};

		return { data };
	}
}

export default UmbLanguageCollectionRepository;
