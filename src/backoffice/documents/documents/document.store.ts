import { map, Observable } from 'rxjs';
import { createStoreItem, UmbNodeStoreBase, UmbStoreItem } from '@umbraco-cms/stores/store';
import type { DocumentDetails } from '@umbraco-cms/models';
import { DocumentResource } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { createTreeItem, isTreeItem, UmbTreeItem } from 'src/backoffice/shared/components/tree';
import { UmbContextToken } from '@umbraco-cms/context-api';

export type UmbDocumentDetailsStoreItem = DocumentDetails & UmbStoreItem;
export type UmbDocumentStoreItem = UmbDocumentDetailsStoreItem | UmbTreeItem;

export const isDocumentDetail = (
	document: UmbDocumentDetailsStoreItem | UmbTreeItem
): document is UmbDocumentDetailsStoreItem => {
	return (document as DocumentDetails).data !== undefined;
};

// TODO: research how we write names of global consts.
export const STORE_ALIAS = 'UmbDocumentStore';

/**
 * @export
 * @class UmbDocumentStore
 * @extends {UmbDocumentStoreBase<UmbDocumentStoreItem>}
 * @description - Data Store for Documents
 */
export class UmbDocumentStore extends UmbNodeStoreBase<UmbDocumentStoreItem> {
	public readonly storeAlias = STORE_ALIAS;

	getItem(unique: string): Observable<UmbDocumentDetailsStoreItem | null> {
		// TODO: use backend cli when available.
		fetch(`/umbraco/management/api/v1/document/details/${unique}`)
			.then((res) => res.json())
			.then((data: DocumentDetails) => {
				const storeItem = createStoreItem(data.key, data.parentKey, data);
				this.updateItems([storeItem]);
			});

		return this.items.pipe(
			map(
				(items) =>
					(items.find((item) => isDocumentDetail(item) && item.unique === unique) as UmbDocumentDetailsStoreItem) ||
					null
			)
		);
	}

	// TODO: make sure UI somehow can follow the status of this action.
	save(data: UmbDocumentDetailsStoreItem[]): Promise<void> {
		// fetch from server and update store
		// TODO: use Fetcher API.
		let body: string;

		try {
			body = JSON.stringify(data);
		} catch (error) {
			console.error(error);
			return Promise.reject();
		}

		// TODO: use backend cli when available.
		return fetch('/umbraco/management/api/v1/document/save', {
			method: 'POST',
			body: body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((data: Array<DocumentDetails>) => {
				const storeItems = data.map((item) => createStoreItem(item.key, item.parentKey, item));
				this.updateItems(storeItems);
			});
	}

	// TODO: how do we handle trashed items?
	async trash(keys: Array<string>) {
		// TODO: use backend cli when available.
		const res = await fetch('/umbraco/management/api/v1/document/trash', {
			method: 'POST',
			body: JSON.stringify(keys),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = (await res.json()) as Array<DocumentDetails>;
		const storeItems = data.map((item) => createStoreItem(item.key, item.parentKey, item));
		this.updateItems(storeItems);
	}

	getTreeRoot(): Observable<Array<UmbTreeItem>> {
		tryExecuteAndNotify(this.host, DocumentResource.getTreeDocumentRoot({})).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) => createTreeItem(item.key, item.parentKey, item));
				this.updateItems(treeItems);
			}
		});

		// TODO: how do we handle trashed items?
		// TODO: remove ignore when we know how to handle trashed items.
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && item.parentUnique === null && !item.isTrashed))
		);
	}

	getTreeItemChildren(unique: string): Observable<Array<UmbTreeItem>> {
		tryExecuteAndNotify(
			this.host,
			DocumentResource.getTreeDocumentChildren({
				parentKey: unique,
			})
		).then(({ data }) => {
			if (data) {
				const treeItems = data.items.map((item) => createTreeItem(item.key, item.parentKey, item));
				this.updateItems(treeItems);
			}
		});

		// TODO: how do we handle trashed items?
		// TODO: remove ignore when we know how to handle trashed items.
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && item.parentUnique === unique && !item.isTrashed))
		);
	}

	getTreeItems(uniques: Array<string> = []): Observable<Array<UmbTreeItem>> {
		if (uniques?.length > 0) {
			tryExecuteAndNotify(
				this.host,
				DocumentResource.getTreeDocumentItem({
					key: uniques,
				})
			).then(({ data }) => {
				if (data) {
					const treeItems = data.map((item) => createTreeItem(item.key, item.parentKey, item));
					this.updateItems(treeItems);
				}
			});
		}

		return this.items.pipe(
			map((items) => items.filter((item) => isTreeItem(item) && uniques.includes(item.unique)) as Array<UmbTreeItem>)
		);
	}
}

export const UMB_DOCUMENT_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbDocumentStore>(STORE_ALIAS);
