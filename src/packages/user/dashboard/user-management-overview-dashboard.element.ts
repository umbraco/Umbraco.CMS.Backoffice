import { UmbUserOrderBy, UmbUserStateFilter } from '../user/collection/utils/index.js';
import { UMB_USER_WORKSPACE_PATH } from '../user/paths.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state, query } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbUserDetailModel } from '@umbraco-cms/backoffice/user';
import { UmbUserCollectionRepository } from '@umbraco-cms/backoffice/user';
import { UmbUserGroupCollectionRepository } from '@umbraco-cms/backoffice/user-group';
import { UmbDirection } from '@umbraco-cms/backoffice/utils';
import type { UmbMasonryLayoutOptions } from '@umbraco-cms/backoffice/components';

const elementName = 'umb-user-management-overview-dashboard';
@customElement('umb-user-management-overview-dashboard')
export class UmbUserManagementOverviewDashboardElement extends UmbLitElement {
	#userCollectionRepository = new UmbUserCollectionRepository(this);
	#userGroupCollectionRepository = new UmbUserGroupCollectionRepository(this);

	@state()
	private _userCount = 0;

	@state()
	private _userGroupCount = 0;

	@state()
	private _lastLoggedInUsers: UmbUserDetailModel[] = [];

	@state()
	private _invitedUsers: UmbUserDetailModel[] = [];

	@query('#total-user-groups')
	private _totalUserGroupsElement!: HTMLElement;

	@query('#recent-active-users')
	private _recentActiveUsersElement!: HTMLElement;

	@query('#invited-users')
	private _invitedUsersElement!: HTMLElement;

	#masonryLayoutOptions: UmbMasonryLayoutOptions = {
		gap: 20,
	};

	constructor() {
		super();
		this.#loadTotalUserGroups();
		this.#loadLastLoggedInUsers();
	}

	async #loadTotalUserGroups() {
		const { data } = await this.#userGroupCollectionRepository.requestCollection({ take: 1 });
		this._userGroupCount = data?.total ?? 0;
		this._totalUserGroupsElement.dispatchEvent(
			new CustomEvent('masonry-item-updated', { bubbles: true, composed: true }),
		);
	}

	async #loadLastLoggedInUsers() {
		const { data } = await this.#userCollectionRepository.requestCollection({
			take: 5,
			orderBy: UmbUserOrderBy.LAST_LOGIN_DATE,
			orderDirection: UmbDirection.DESCENDING,
		});
		this._lastLoggedInUsers = data?.items ?? [];
		this._recentActiveUsersElement.dispatchEvent(
			new CustomEvent('masonry-item-updated', { bubbles: true, composed: true }),
		);
	}

	override render() {
		return html`
			<section id="content">
				<umb-masonry-layout .options=${this.#masonryLayoutOptions}>
					${this.#renderUserGroupCount()} ${this.#renderLastLoggedInUsers()} ${this.#renderInvitedUsers()}
				</umb-masonry-layout>
			</section>
		`;
	}

	#renderUserGroupCount() {
		return html` <uui-box id="total-user-groups" headline="Total user groups">
			<span class="large">${this._userGroupCount}</span>
		</uui-box>`;
	}

	#renderLastLoggedInUsers() {
		return html` <uui-box id="recent-active-users" headline="Recent active users">
			${this._lastLoggedInUsers.map((user) => this.#renderUserRef(user))}
		</uui-box>`;
	}

	#renderInvitedUsers() {
		return html` <uui-box id="invited-users" headline="Invited users">
			${this._invitedUsers.map((user) => this.#renderUserRef(user))}
		</uui-box>`;
	}

	#renderUserRef(user: UmbUserDetailModel) {
		return html` <uui-ref-node-user name=${user.name} href=${UMB_USER_WORKSPACE_PATH + '/edit/' + user.unique}>
			<umb-user-avatar
				style="font-size: 0.5em"
				slot="icon"
				.name=${user.name}
				.kind=${user.kind}
				.imgUrls=${user.avatarUrls}>
			</umb-user-avatar>
		</uui-ref-node-user>`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			#content {
				padding: var(--uui-size-layout-1);
			}

			uui-ref-node-user {
				min-width: auto;
			}

			.large {
				font-size: 3rem;
				font-weight: bold;
			}
		`,
	];
}

export { UmbUserManagementOverviewDashboardElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbUserManagementOverviewDashboardElement;
	}
}
