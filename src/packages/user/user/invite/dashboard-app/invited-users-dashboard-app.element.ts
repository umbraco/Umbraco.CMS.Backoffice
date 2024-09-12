import { UmbUserStateFilter } from '../../collection/utils/index.js';
import { UmbUserCollectionRepository } from '../../collection/index.js';
import type { UmbUserDetailModel } from '../../types.js';
import { UMB_USER_WORKSPACE_PATH } from '../../paths.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-invited-users-dashboard-app';
@customElement(elementName)
export class UmbInvitedUsersDashboardAppElement extends UmbLitElement {
	#userCollectionRepository = new UmbUserCollectionRepository(this);

	@state()
	private _invitedUsers: UmbUserDetailModel[] = [];

	protected override firstUpdated(): void {
		this.#loadInvitedUsers();
	}

	async #loadInvitedUsers() {
		const { data } = await this.#userCollectionRepository.requestCollection({
			take: 5,
			userStates: [UmbUserStateFilter.INVITED],
		});
		this._invitedUsers = data?.items ?? [];
		this.dispatchEvent(new CustomEvent('masonry-item-updated', { bubbles: true, composed: true }));
	}

	override render() {
		return html`
			<uui-box headline="Pending invites">
				${this._invitedUsers.map(
					(user) => html`
						<uui-ref-node-user name=${user.name} href=${UMB_USER_WORKSPACE_PATH + '/edit/' + user.unique}>
							<umb-user-avatar
								style="font-size: 0.5em"
								slot="icon"
								.name=${user.name}
								.kind=${user.kind}
								.imgUrls=${user.avatarUrls}>
							</umb-user-avatar>
						</uui-ref-node-user>
					`,
				)}
			</uui-box>
		`;
	}

	static override styles = [UmbTextStyles, css``];
}

export { UmbInvitedUsersDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbInvitedUsersDashboardAppElement;
	}
}
