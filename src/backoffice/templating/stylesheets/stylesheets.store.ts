import { map, Observable } from 'rxjs';
import { UmbSystemFileStoreBase } from '../../../core/stores/store';
import type { StylesheetDetails } from '@umbraco-cms/models';
import { FileSystemTreeItem, StylesheetResource } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';

export type UmbStylesheetStoreItemType = StylesheetDetails | FileSystemTreeItem;

// TODO: research how we write names of global consts.
export const STORE_ALIAS = 'umbStylesheetStore';

/**
 * @export
 * @class UmbDocumentStore
 * @extends {UmbDocumentStoreBase<DocumentDetails | DocumentTreeItem>}
 * @description - Data Store for Documents
 */
export class UmbStylesheetStore extends UmbSystemFileStoreBase<UmbStylesheetStoreItemType> {
	public readonly storeAlias = STORE_ALIAS;

	getByPath(path: string): Observable<StylesheetDetails> {
		return this.items.pipe(map((items) => items.find((item) => item.path === path) as StylesheetDetails));
	}

	getTreeRoot(): Observable<Array<FileSystemTreeItem>> {
		tryExecuteAndNotify(this.host, StylesheetResource.getTreeStylesheetRoot({})).then(({ data }) => {
			if (data) {
				this.updateItems(data.items, 'path');
			}
		});

		return this.items.pipe(map((items) => items.filter((item) => item.path?.includes('/') === false)));
	}

	getTreeItemChildren(path: string): Observable<Array<FileSystemTreeItem>> {
		tryExecuteAndNotify(
			this.host,
			StylesheetResource.getTreeStylesheetChildren({
				path,
			})
		).then(({ data }) => {
			if (data) {
				this.updateItems(data.items, 'path');
			}
		});

		return this.items.pipe(map((items) => items.filter((item) => item.path?.startsWith(path))));
	}

	getTreeItems(paths: Array<string>): Observable<Array<FileSystemTreeItem>> {
		if (paths?.length > 0) {
			tryExecuteAndNotify(
				this.host,
				StylesheetResource.getTreeStylesheetItem({
					path: paths,
				})
			).then(({ data }) => {
				if (data) {
					this.updateItems(data, 'path');
				}
			});
		}

		return this.items.pipe(map((items) => items.filter((item) => paths.includes(item.path ?? ''))));
	}
}
