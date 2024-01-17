import type { UmbItemRepository } from '@umbraco-cms/backoffice/repository';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { type ManifestRepository, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';

export class UmbRepositoryItemsManager<ItemType> extends UmbBaseController {
	//
	repository?: UmbItemRepository<ItemType>;
	#getUnique: (entry: ItemType) => string | undefined;

	#init: Promise<unknown>;

	// the init promise is used externally for recognizing when the manager is ready.
	public get init() {
		return this.#init;
	}

	#uniques = new UmbArrayState<string>([], (x) => x);
	uniques = this.#uniques.asObservable();

	#items = new UmbArrayState<ItemType>([], (x) => this.#getUnique(x));
	items = this.#items.asObservable();

	/* TODO: find a better way to have a getUniqueMethod. If we want to support trees/items of different types,
	then it need to be bound to the type and can't be a generic method we pass in. */
	constructor(
		host: UmbControllerHost,
		repositoryAlias: string,
		getUniqueMethod?: (entry: ItemType) => string | undefined,
	) {
		super(host);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.#getUnique = getUniqueMethod || ((entry) => entry.id || '');

		this.#init = new UmbExtensionApiInitializer<ManifestRepository<UmbItemRepository<ItemType>>>(
			this,
			umbExtensionsRegistry,
			repositoryAlias,
			[this],
			(permitted, repository) => {
				this.repository = permitted ? repository.api : undefined;
			},
		).asPromise();
	}

	getUniques() {
		return this.#uniques.value;
	}

	setUniques(uniques: string[]) {
		this.#uniques.setValue(uniques);
		//TODO: Check if it's safe to call requestItems here.
		// We don't have to request items if there is no uniques.
		if (uniques.length === 0) {
			this.#items.setValue([]);
			return;
		}

		this.#requestItems();
	}

	getItems() {
		return this.#items.value;
	}

	async #requestItems() {
		await this.#init;
		if (!this.repository) throw new Error('Repository is not initialized');

		// TODO: Test if its just some items that is gone now, if so then just filter them out. (maybe use code from #removeItem)
		// This is where this.#getUnique comes in play. Unless that can come from the repository, but that collides with the idea of having a multi-type repository. If that happens.

		const { asObservable } = await this.repository.requestItems(this.getUniques());

		if (asObservable) {
			this.observe(asObservable(), (data) => this.#items.setValue(data), '_observeRequestedItems');
		}
	}

	/*
	#removeItem(unique: string) {
		const newSelection = this.getSelection().filter((value) => value !== unique);
		this.#selection.next(newSelection);
		// remove items items from selectedItems array
		// TODO: id won't always be available on the model, so we need to get the unique property from somewhere. Maybe the repository?
		const newSelectedItems = this.#selectedItems.value.filter((item) => this.#getUnique(item) !== unique);
		this.#selectedItems.next(newSelectedItems);
	}
	*/
}
