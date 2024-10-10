import { UMB_MEDIA_PLACEHOLDER_ENTITY_TYPE } from '../entity.js';
import { UMB_MEDIA_GRID_COLLECTION_VIEW_ALIAS } from './views/index.js';
import type { UmbMediaCollectionFilterModel, UmbMediaCollectionItemModel } from './types.js';
import { UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
export class UmbMediaCollectionContext extends UmbDefaultCollectionContext<
	UmbMediaCollectionItemModel,
	UmbMediaCollectionFilterModel
> {
	/**
	 * The thumbnail items that are currently displayed in the collection.
	 * @deprecated Use the `<umb-imaging-thumbnail>` element instead.
	 */
	public readonly thumbnailItems = this.items;

	#placeholderItems = new UmbArrayState<UmbMediaCollectionItemModel>([], (x) => x.unique);
	public readonly placeholderItems = this._items.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_MEDIA_GRID_COLLECTION_VIEW_ALIAS);
	}

	setPlaceholderItems(partialPlaceholders: Array<{ unique: string; name?: string }>) {
		const currentItems = this._items.getValue();

		// We do not want to set a placeholder which unique already exists in the collection.
		const date = new Date();
		const placeholders: Array<UmbMediaCollectionItemModel> = partialPlaceholders
			.filter((placeholder) => !currentItems.find((item) => item.unique === placeholder.unique))
			.map((placeholder) => ({
				updateDate: date,
				createDate: date,
				entityType: UMB_MEDIA_PLACEHOLDER_ENTITY_TYPE,
				...placeholder,
			}));

		this.#placeholderItems.setValue(placeholders);

		this._items.setValue([...placeholders, ...currentItems]);
		this._totalItems.setValue(this._items.getValue().length);
	}

	/**
	 * Requests the collection from the repository.
	 * @returns {*}
	 * @memberof UmbCollectionContext
	 */
	public override async requestCollection() {
		await this._init;

		if (!this._configured) this._configure();

		if (!this._repository) throw new Error(`Missing repository for ${this._manifest}`);

		this._loading.setValue(true);

		const filter = this._filter.getValue();
		const { data } = await this._repository.requestCollection(filter);

		if (data) {
			this.#cleanupPlaceholdersFromCollection(data.items);
			const placeholderItems = this.#placeholderItems.getValue();

			this._items.setValue([...placeholderItems, ...data.items]);
			this._totalItems.setValue(data.total + placeholderItems.length);
			this.pagination.setTotalItems(data.total + placeholderItems.length);
		}

		this._loading.setValue(false);
	}

	#cleanupPlaceholdersFromCollection(collectionItems: Array<UmbMediaCollectionItemModel>) {
		const duplicates = this.#placeholderItems
			.getValue()
			.filter((placeholder) => collectionItems.find((item) => item.unique === placeholder.unique));

		for (const duplicate of duplicates) {
			this.#placeholderItems.removeOne(duplicate.unique);
		}
	}
}

export { UmbMediaCollectionContext as api };
