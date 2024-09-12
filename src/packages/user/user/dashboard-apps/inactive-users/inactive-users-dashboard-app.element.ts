import { UmbUserOrderBy, UmbUserStateFilter } from '../../collection/utils/index.js';
import { UmbUserCollectionRepository } from '../../collection/index.js';
import type { UmbUserDetailModel } from '../../types.js';
import { UMB_USER_WORKSPACE_PATH } from '../../paths.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbDirection } from '@umbraco-cms/backoffice/utils';

const elementName = 'umb-inactive-users-dashboard-app';
@customElement(elementName)
export class UmbInactiveUsersDashboardAppElement extends UmbLitElement {
	#userCollectionRepository = new UmbUserCollectionRepository(this);

	@state()
	private _inactiveUsers: UmbUserDetailModel[] = [];

	protected override firstUpdated(): void {
		this.#loadInactiveUsers();
	}

	async #loadInactiveUsers() {
		const { data } = await this.#userCollectionRepository.requestCollection({
			take: 5,
			orderDirection: UmbDirection.ASCENDING,
			orderBy: UmbUserOrderBy.CREATE_DATE,
			userStates: [UmbUserStateFilter.INACTIVE],
		});
		this._inactiveUsers = data?.items ?? [];
		this.dispatchEvent(new CustomEvent('masonry-item-updated', { bubbles: true, composed: true }));
	}

	override render() {
		return html`
			<uui-box headline="Inactive users">
				${this._inactiveUsers.map(
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

export { UmbInactiveUsersDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbInactiveUsersDashboardAppElement;
	}
}
