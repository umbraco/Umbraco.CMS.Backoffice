import { map, Observable } from 'rxjs';
import { createStoreItem, UmbNodeStoreBase, UmbStoreItem } from '../../../core/stores/store';
import { serverPathFromFileUnique, fileParentPath, fileUniqueFromServerPath } from '../utils';
import type { StylesheetDetails } from '@umbraco-cms/models';
import { StylesheetResource } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { createTreeItem, isTreeItem, UmbTreeItem } from 'src/backoffice/shared/components/tree';

export type UmbStylesheetDetailsStoreItem = StylesheetDetails & UmbStoreItem;
export type UmbStylesheetStoreItem = UmbStylesheetDetailsStoreItem | UmbTreeItem;

const isStylesheetDetail = (stylesheet: UmbStylesheetStoreItem): stylesheet is UmbStylesheetDetailsStoreItem => {
	return (stylesheet as UmbStylesheetDetailsStoreItem).content !== undefined;
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

	getItem(unique: string): Observable<UmbStylesheetDetailsStoreItem | null> {
		const serverPath = serverPathFromFileUnique(unique);
		const encodedServerPath = encodeURIComponent(serverPath);
		fetch(`/umbraco/management/api/v1/stylesheet/details/${encodedServerPath}`)
			.then((res) => res.json())
			.then((data: StylesheetDetails) => {
				const storeItem = createStoreItem(
					fileUniqueFromServerPath(data.path),
					fileUniqueFromServerPath(fileParentPath(data.path)),
					data
				);
				this.updateItems([storeItem]);
			});

		return this.items.pipe(
			map(
				(items) =>
					(items.find((item) => isStylesheetDetail(item) && item.unique === unique) as UmbStylesheetDetailsStoreItem) ||
					null
			)
		);
	}

	getTreeRoot(): Observable<Array<UmbTreeItem>> {
		tryExecuteAndNotify(this.host, StylesheetResource.getTreeStylesheetRoot({})).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) => createTreeItem(fileUniqueFromServerPath(item.path), null, item));
				this.updateItems(treeItems);
			}
		});

		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && item.parentUnique === null) as Array<UmbTreeItem>)
		);
	}

	getTreeItemChildren(unique: string): Observable<Array<UmbTreeItem>> {
		const serverPath = serverPathFromFileUnique(unique);
		const encodedServerPath = encodeURIComponent(serverPath);

		tryExecuteAndNotify(
			this.host,
			StylesheetResource.getTreeStylesheetChildren({
				path: encodedServerPath,
			})
		).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) =>
					createTreeItem(fileUniqueFromServerPath(item.path), fileUniqueFromServerPath(fileParentPath(item.path)), item)
				);
				this.updateItems(treeItems);
			}
		});

		return this.items.pipe(
			map(
				(items) =>
					items.filter(
						(item) => isTreeItem(item) && item.unique.startsWith(unique + encodeURIComponent('/'))
					) as Array<UmbTreeItem>
			)
		);
	}

	getTreeItems(uniques: Array<string>): Observable<Array<UmbTreeItem>> {
		if (uniques?.length > 0) {
			const serverPaths = uniques.map((unique) => serverPathFromFileUnique(unique));
			const encodedServerPaths = serverPaths.map((path) => encodeURIComponent(path));

			tryExecuteAndNotify(
				this.host,
				StylesheetResource.getTreeStylesheetItem({
					path: encodedServerPaths,
				})
			).then(({ data }) => {
				if (data) {
					const treeItems = data.map((item) =>
						createTreeItem(
							fileUniqueFromServerPath(item.path),
							fileUniqueFromServerPath(fileParentPath(item.path)),
							item
						)
					);
					this.updateItems(treeItems);
				}
			});
		}

		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && uniques.includes(item.unique)) as Array<UmbTreeItem>)
		);
	}

	save(): Promise<void> {
		return new Promise((resolve) => {
			resolve(console.log('save stylesheet'));
		});
	}
}
