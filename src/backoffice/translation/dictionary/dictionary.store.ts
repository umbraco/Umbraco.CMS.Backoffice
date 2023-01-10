import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../../../core/stores/store';
import { ApiError, DictionaryResource, EntityTreeItem, ProblemDetails } from '@umbraco-cms/backend-api';
import type { DictionaryDetails } from '@umbraco-cms/models';

export type UmbDictionaryStoreItemType = DictionaryDetails | EntityTreeItem;

/**
 * @export
 * @class UmbDictionaryStore
 * @extends {UmbDataStoreBase<UmbDictionaryStoreItemType | EntityTreeItem>}
 * @description - Data Store for Dictionary Items.
 */
export class UmbDictionaryStore extends UmbDataStoreBase<UmbDictionaryStoreItemType> {
	public readonly storeAlias = 'umbDictionaryStore';

	/**
	 * @description - Get the root of the tree.
	 * @return {*}  {Observable<Array<PagedEntityTreeItem>>}
	 * @memberof UmbDictionaryStore
	 */
	getTreeRoot(): Observable<Array<UmbDictionaryStoreItemType>> {
		DictionaryResource.getTreeDictionaryRoot({}).then(
			(res) => {
				this.updateItems(res.items);
			},
			(e) => {
				if (e instanceof ApiError) {
					const error = e.body as ProblemDetails;
					if (e.status === 400) {
						console.log(error.detail);
					}
				}
			}
		);

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === null)));
	}

	/**
	 * @description - Get the children of a tree item.
	 * @param {string} key
	 * @return {*}  {Observable<Array<UmbDictionaryStoreItemType>>}
	 * @memberof UmbDataTypesStore
	 */
	getTreeItemChildren(key: string): Observable<Array<UmbDictionaryStoreItemType>> {
		DictionaryResource.getTreeDictionaryChildren({
			parentKey: key,
		}).then(
			(res) => {
				this.updateItems(res.items);
			},
			(e) => {
				if (e instanceof ApiError) {
					const error = e.body as ProblemDetails;
					if (e.status === 400) {
						console.log(error.detail);
					}
				}
			}
		);

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === key)));
	}

	/**
	 * @description - Request a Dictionary by key. The Dictionary is added to the store and is returned as an Observable.
	 * @param {string} key
	 * @return {*}  {(Observable<DictionaryDetails | null>)}
	 * @memberof UmbDictionaryStore
	 */
	getByKey(key: string): Observable<DictionaryDetails | null> {
		// TODO: use backend cli when available.
		fetch(`/umbraco/backoffice/dictionary/details/${key}`)
			.then((res) => res.json())
			.then((data) => {
				this.updateItems(data);
			});

		return this.items.pipe(
			map((dictionary) => (dictionary.find((entry) => entry.key === key) as DictionaryDetails) || null)
		);
	}

	async save(users: Array<UmbDictionaryStoreItemType>): Promise<void> {
		// TODO: use Fetcher API.
		try {
			const res = await fetch('/umbraco/backoffice/dictionary/save', {
				method: 'POST',
				body: JSON.stringify(users),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const json = await res.json();
			this.updateItems(json);
		} catch (error) {
			console.error('Save Data Type error', error);
		}
	}
}
