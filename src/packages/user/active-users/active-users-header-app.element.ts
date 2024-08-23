import { UMB_ACTIVE_USERS_CONTEXT } from './active-users.context.token.js';
import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbHeaderAppButtonElement } from '@umbraco-cms/backoffice/components';
import type { UmbUserItemModel } from '@umbraco-cms/backoffice/user';
import { UmbUserItemRepository } from '@umbraco-cms/backoffice/user';

@customElement('umb-active-users-header-app')
export class UmbActiveUsersHeaderAppElement extends UmbHeaderAppButtonElement {
	#activeUsersContext?: typeof UMB_ACTIVE_USERS_CONTEXT.TYPE;
	#userItemRepository = new UmbUserItemRepository(this);

	@state()
	_activeUsers: Array<UmbUserItemModel> = [];

	constructor() {
		super();

		this.consumeContext(UMB_ACTIVE_USERS_CONTEXT, (context) => {
			this.#activeUsersContext = context;
			this.#observeActiveUsers();
		});
	}

	#observeActiveUsers() {
		this.observe(this.#activeUsersContext?.activeUsers, async (activeUsers) => {
			if (!activeUsers) {
				this._activeUsers = [];
				return;
			}

			const { data } = await this.#userItemRepository.requestItems(activeUsers);

			if (data) {
				this._activeUsers = data;
			}
		});
	}

	override render() {
		return html`
			<uui-avatar-group style="font-size: 0.75em; --uui-avatar-border-color: white;">
				${this._activeUsers.map((user) => html`<uui-avatar name=${user.name}></uui-avatar>`)}
			</uui-avatar-group>
		`;
	}
}

export { UmbActiveUsersHeaderAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'umb-active-users-header-app': UmbActiveUsersHeaderAppElement;
	}
}
