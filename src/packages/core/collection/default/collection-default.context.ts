import type { UmbCollectionColumnConfiguration, UmbCollectionConfiguration, UmbCollectionContext } from '../types.js';
import { UmbCollectionViewManager } from '../collection-view.manager.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbArrayState, UmbNumberState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbSelectionManager, UmbPaginationManager } from '@umbraco-cms/backoffice/utils';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { ManifestCollection, ManifestRepository } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';
import type { UmbCollectionFilterModel, UmbCollectionRepository } from '@umbraco-cms/backoffice/collection';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbDefaultCollectionContext<
		CollectionItemType = any,
		FilterModelType extends UmbCollectionFilterModel = any,
	>
	extends UmbContextBase<UmbDefaultCollectionContext>
	implements UmbCollectionContext, UmbApi
{
	#manifest?: ManifestCollection;

	#items = new UmbArrayState<CollectionItemType>([], (x) => x);
	public readonly items = this.#items.asObservable();

	#totalItems = new UmbNumberState(0);
	public readonly totalItems = this.#totalItems.asObservable();

	#filter = new UmbObjectState<FilterModelType | object>({});
	public readonly filter = this.#filter.asObservable();

	#userDefinedProperties = new UmbArrayState<UmbCollectionColumnConfiguration>([], (x) => x);
	public readonly userDefinedProperties = this.#userDefinedProperties.asObservable();

	repository?: UmbCollectionRepository;

	#initResolver?: () => void;
	#initialized = false;

	#init = new Promise<void>((resolve) => {
		this.#initialized ? resolve() : (this.#initResolver = resolve);
	});

	public readonly pagination = new UmbPaginationManager();
	public readonly selection = new UmbSelectionManager(this);
	public readonly view;

	constructor(host: UmbControllerHost, defaultViewAlias: string) {
		super(host, UMB_DEFAULT_COLLECTION_CONTEXT);

		// listen for page changes on the pagination manager
		this.pagination.addEventListener(UmbChangeEvent.TYPE, this.#onPageChange);

		this.view = new UmbCollectionViewManager(this, { defaultViewAlias: defaultViewAlias });
	}

	// TODO: find a generic way to do this
	#checkIfInitialized() {
		if (this.repository) {
			this.#initialized = true;
			this.#initResolver?.();
		}
	}

	#config: UmbCollectionConfiguration = { pageSize: 50 };

	/**
	 * Sets the configuration for the collection.
	 * @param {UmbCollectionConfiguration} config
	 * @memberof UmbCollectionContext
	 */
	public setConfig(config: UmbCollectionConfiguration) {
		this.#config = config;
		this.#configure();
	}

	public getConfig() {
		return this.#config;
	}

	/**
	 * Sets the manifest for the collection.
	 * @param {ManifestCollection} manifest
	 * @memberof UmbCollectionContext
	 */
	public setManifest(manifest: ManifestCollection | undefined) {
		if (this.#manifest === manifest) return;
		this.#manifest = manifest;

		if (!this.#manifest) return;
		this.#observeRepository(this.#manifest.meta.repositoryAlias);
	}

	/**
	 * Returns the manifest for the collection.
	 * @return {ManifestCollection}
	 * @memberof UmbCollectionContext
	 */
	public getManifest() {
		return this.#manifest;
	}

	/**
	 * Requests the collection from the repository.
	 * @return {*}
	 * @memberof UmbCollectionContext
	 */
	public async requestCollection() {
		await this.#init;
		if (!this.repository) throw new Error(`Missing repository for ${this.#manifest}`);

		const filter = this.#filter.getValue();
		const { data } = await this.repository.requestCollection(filter);

		if (data) {
			this.#items.setValue(data.items);
			this.#totalItems.setValue(data.total);
			this.pagination.setTotalItems(data.total);
		}
	}

	/**
	 * Sets the filter for the collection and refreshes the collection.
	 * @param {Partial<FilterModelType>} filter
	 * @memberof UmbCollectionContext
	 */
	public setFilter(filter: Partial<FilterModelType>) {
		this.#filter.setValue({ ...this.#filter.getValue(), ...filter });
		this.requestCollection();
	}

	#configure() {
		this.selection.setMultiple(true);
		this.pagination.setPageSize(this.#config.pageSize!);
		this.#filter.setValue({
			...this.#config,
			...this.#filter.getValue(),
			skip: 0,
			take: this.#config.pageSize,
		});
		this.#userDefinedProperties.setValue(this.#config.userDefinedProperties ?? []);
	}

	#onPageChange = (event: UmbChangeEvent) => {
		const target = event.target as UmbPaginationManager;
		const skipFilter = { skip: target.getSkip() } as Partial<FilterModelType>;
		this.setFilter(skipFilter);
	};

	#observeRepository(repositoryAlias: string) {
		new UmbExtensionApiInitializer<ManifestRepository<UmbCollectionRepository>>(
			this,
			umbExtensionsRegistry,
			repositoryAlias,
			[this._host],
			(permitted, ctrl) => {
				this.repository = permitted ? ctrl.api : undefined;
				this.#checkIfInitialized();
			},
		);
	}
}

export const UMB_DEFAULT_COLLECTION_CONTEXT = new UmbContextToken<UmbDefaultCollectionContext>('UmbCollectionContext');
