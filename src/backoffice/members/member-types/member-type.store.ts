import { map, Observable } from 'rxjs';
import { UmbDataStoreBase } from '../../../core/stores/store';
import { MemberTypeResource, EntityTreeItem } from '@umbraco-cms/backend-api';
import type { MemberTypeDetails } from '@umbraco-cms/models';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { UmbContextToken } from '@umbraco-cms/context-api';

export type UmbMemberTypeStoreItemType = MemberTypeDetails | EntityTreeItem;

export const STORE_ALIAS = 'UmbMemberTypeStore';

/**
 * @export
 * @class UmbMemberTypeStore
 * @extends {UmbDataStoreBase<MemberTypeDetails | EntityTreeItem>}
 * @description - Data Store for Member Types
 */
export class UmbMemberTypeStore extends UmbDataStoreBase<UmbMemberTypeStoreItemType> {
	public readonly storeAlias = STORE_ALIAS;

	getByKey(key: string): Observable<UmbMemberTypeStoreItemType | null> {
		return null as any;
	}

	async save(mediaTypes: Array<UmbMemberTypeStoreItemType>): Promise<void> {
		return null as any;
	}

	getTreeRoot(): Observable<Array<EntityTreeItem>> {
		tryExecuteAndNotify(this.host, MemberTypeResource.getTreeMemberTypeRoot({})).then(({ data }) => {
			if (data) {
				this.updateItems(data.items);
			}
		});

		return this.items.pipe(map((items) => items.filter((item) => item.parentKey === null)));
	}
}

export const UMB_MEMBER_TYPE_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbMemberTypeStore>(STORE_ALIAS);
