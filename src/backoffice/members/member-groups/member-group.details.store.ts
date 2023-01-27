import { Observable } from 'rxjs';
import type { MemberGroupDetails } from '@umbraco-cms/models';
import { UmbContextToken } from '@umbraco-cms/context-api';
import { ArrayState } from '@umbraco-cms/observable-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { UmbEntityDetailStore, UmbStoreBase } from '@umbraco-cms/store';

export const UMB_MEMBER_GROUP_STORE_CONTEXT_TOKEN = new UmbContextToken<UmbMemberGroupStore>('UmbMemberGroupStore');

/**
 * @export
 * @class UmbMemberGroupStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Member Groups
 */
export class UmbMemberGroupStore extends UmbStoreBase implements UmbEntityDetailStore<MemberGroupDetails> {


	#groups = new ArrayState<MemberGroupDetails>([], x => x.key);
	public groups = this.#groups.asObservable();


	constructor(host: UmbControllerHostInterface) {
		super(host, UMB_MEMBER_GROUP_STORE_CONTEXT_TOKEN.toString());
	}

	getScaffold(entityType: string, parentKey: string | null) {
		return {
		} as MemberGroupDetails;
	}

	getByKey(key: string): Observable<MemberGroupDetails | undefined> {
		return null as any;
	}

	async save(memberGroups: Array<MemberGroupDetails>): Promise<void> {
		return null as any;
	}
}
