import { map, Observable } from 'rxjs';
import { createStoreItem, UmbNodeStoreBase, UmbStoreItem } from '../../../core/stores/store';
import type { StylesheetDetails } from '@umbraco-cms/models';
import { StylesheetResource } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { createTreeItem, isTreeItem, UmbTreeItem } from 'src/backoffice/shared/components/tree';

export type UmbStylesheetStoreDetailItem = StylesheetDetails & UmbStoreItem;
export type UmbStylesheetStoreItem = UmbStylesheetStoreDetailItem | UmbTreeItem;

const isStylesheetDetail = (stylesheet: UmbStylesheetStoreItem): stylesheet is UmbStylesheetStoreDetailItem => {
	return (stylesheet as UmbStylesheetStoreDetailItem).content !== undefined;
};

export const STORE_ALIAS = 'umbStylesheetStore';

/**
 * @export
 * @class UmbStylesheetStore
 * @extends {UmbDocumentStoreBase<UmbStylesheetStoreItem>}
 * @description - Data Store for Stylesheets
 */
export class UmbStylesheetStore extends UmbNodeStoreBase<UmbStylesheetStoreItem> {
	public readonly storeAlias = STORE_ALIAS;

	getItem(unique: string): Observable<UmbStylesheetStoreDetailItem | null> {
		fetch(`/umbraco/management/api/v1/stylesheets/details/${unique}`)
			.then((res) => res.json())
			.then((data: StylesheetDetails) => {
				const storeItem = createStoreItem(data.path, data);
				this.updateItems([storeItem]);
			});

		return this.items.pipe(
			map(
				(items) =>
					(items.find((item) => isStylesheetDetail(item) && item.unique === unique) as UmbStylesheetStoreDetailItem) ||
					null
			)
		);
	}

	getTreeRoot(): Observable<Array<UmbTreeItem>> {
		tryExecuteAndNotify(this.host, StylesheetResource.getTreeStylesheetRoot({})).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) => createTreeItem(item.path, null, item));
				this.updateItems(treeItems);
			}
		});

		return this.items.pipe(
			map(
				(items) => items.filter((item) => isTreeItem(item) && item.unique.includes('/') === false) as Array<UmbTreeItem>
			)
		);
	}

	getTreeItemChildren(unique: string): Observable<Array<UmbTreeItem>> {
		tryExecuteAndNotify(
			this.host,
			StylesheetResource.getTreeStylesheetChildren({
				path: unique,
			})
		).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) => createTreeItem(item.path, unique, item));
				this.updateItems(treeItems);
			}
		});

		return this.items.pipe(
			map(
				(items) =>
					items.filter((item) => isTreeItem(item) && item.unique.startsWith(unique + '/')) as Array<UmbTreeItem>
			)
		);
	}

	getTreeItems(paths: Array<string>): Observable<Array<UmbTreeItem>> {
		if (paths?.length > 0) {
			tryExecuteAndNotify(
				this.host,
				StylesheetResource.getTreeStylesheetItem({
					path: paths,
				})
			).then(({ data }) => {
				if (data) {
					// TODO: get parent unique from path
					const treeItems = data.map((item, index) => createTreeItem(item.path, paths[index], item));
					this.updateItems(treeItems);
				}
			});
		}

		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && paths.includes(item.unique)) as Array<UmbTreeItem>)
		);
	}

	save(): Promise<void> {
		return new Promise((resolve) => {
			resolve(console.log('save stylesheet'));
		});
	}
}
