import { Observable } from 'rxjs';
import type { EntityTreeItemResponseModel } from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import {
	UmbContextToken,
	UmbContextConsumerController,
	UmbContextProviderController,
} from '@umbraco-cms/backoffice/context-api';
import { ArrayState, NumberState, StringState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import { umbExtensionsRegistry, createExtensionClass } from '@umbraco-cms/backoffice/extensions-api';
import { UmbCollectionRepository, UmbTreeRepository } from '@umbraco-cms/backoffice/repository';

// TODO: Clean up the need for store as Media has switched to use Repositories(repository).
export class UmbCollectionContext<ItemType> {
	private _host: UmbControllerHostElement;
	private _entityType: string | null;

	protected _dataObserver?: UmbObserverController<ItemType[]>;

	#items = new ArrayState(<Array<ItemType>>[]);
	public readonly items = this.#items.asObservable();

	#total = new NumberState(0);
	public readonly total = this.#total.asObservable();

	#selection = new ArrayState(<Array<string>>[]);
	public readonly selection = this.#selection.asObservable();

	#repository?: UmbCollectionRepository;

	/*
	TODO:
	private _search = new StringState('');
	public readonly search = this._search.asObservable();
	*/

	constructor(host: UmbControllerHostElement, entityType: string | null, repositoryAlias: string) {
		this._entityType = entityType;
		this._host = host;

		new UmbObserverController(
			this._host,
			umbExtensionsRegistry.getByTypeAndAlias('repository', repositoryAlias),
			async (repositoryManifest) => {
				if (repositoryManifest) {
					const result = await createExtensionClass<UmbCollectionRepository>(repositoryManifest, [this._host]);
					this.#repository = result;
					this._onRepositoryReady();
				}
			}
		);
	}

	public isSelected(id: string) {
		return this.#selection.getValue().includes(id);
	}

	public setSelection(value: Array<string>) {
		if (!value) return;
		this.#selection.next(value);
	}

	public clearSelection() {
		this.#selection.next([]);
	}

	public select(id: string) {
		this.#selection.appendOne(id);
	}

	public deselect(id: string) {
		this.#selection.filter((k) => k !== id);
	}

	// TODO: how can we make sure to call this.
	public destroy(): void {
		this.#items.unsubscribe();
	}

	public getEntityType() {
		return this._entityType;
	}

	/*
	public getData() {
		return this.#data.getValue();
	}
	*/

	/*
	public update(data: Partial<DataType>) {
		this._data.next({ ...this.getData(), ...data });
	}
	*/

	// protected _onStoreSubscription(): void {
	// 	if (!this._store) {
	// 		return;
	// 	}

	// 	this._dataObserver?.destroy();

	// 	if (this._entityId) {
	// 		this._dataObserver = new UmbObserverController(
	// 			this._host,
	// 			this._store.getTreeItemChildren(this._entityId),
	// 			(nodes) => {
	// 				if (nodes) {
	// 					this.#data.next(nodes);
	// 				}
	// 			}
	// 		);
	// 	} else {
	// 		this._dataObserver = new UmbObserverController(this._host, this._store.getTreeRoot(), (nodes) => {
	// 			if (nodes) {
	// 				this.#data.next(nodes);
	// 			}
	// 		});
	// 	}
	// }

	protected async _onRepositoryReady() {
		if (!this.#repository) {
			return;
		}

		const { data } = await this.#repository.requestCollection();

		if (data) {
			this.#total.next(data.total);
			this.#items.next(data.items);
		}

		// this._dataObserver?.destroy();

		// const observable = (await this.#repository.requestCollection()).asObservable?.();

		// if (observable) {
		// 	this._dataObserver = new UmbObserverController(this._host, observable as Observable<DataType[]>, (nodes) => {
		// 		if (nodes) {
		// 			this.#data.next(nodes);
		// 		}
		// 	});
		// }
	}

	/*
	TODO:
	public setSearch(value: string) {
		if (!value) value = '';

		this._search.next(value);
	}
	*/
}

export const UMB_COLLECTION_CONTEXT_TOKEN = new UmbContextToken<UmbCollectionContext<any>>('UmbCollectionContext');
