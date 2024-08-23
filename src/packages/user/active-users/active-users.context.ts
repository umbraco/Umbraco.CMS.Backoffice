import { UMB_ACTIVE_USERS_CONTEXT } from './active-users.context.token.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';

export class UmbActiveUsersContext extends UmbContextBase<UmbActiveUsersContext> {
	#activeUsers = new UmbArrayState<string>([], (x) => x);
	public readonly activeUsers = this.#activeUsers.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_ACTIVE_USERS_CONTEXT);
	}
}

export { UmbActiveUsersContext as api };
