import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
	UmbUserGroupStore,
	UMB_USER_GROUP_STORE_CONTEXT_TOKEN,
} from '../../../../user-groups/repository/user-group.store';
import {
	UMB_COLLECTION_CONTEXT_TOKEN,
	UmbCollectionContext,
} from '../../../../../shared/components/collection/collection.context';
import { getLookAndColorFromUserStatus } from '@umbraco-cms/backoffice/utils';
import type { UserDetails, UserEntity, UserGroupEntity } from '@umbraco-cms/backoffice/models';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UserResponseModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-user-grid-collection-view')
export class UmbUserGridCollectionViewElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}

			#user-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
				gap: var(--uui-size-space-4);
				margin: var(--uui-size-layout-1);
				margin-top: var(--uui-size-space-2);
			}

			uui-card-user {
				width: 100%;
				height: 180px;
			}

			.user-login-time {
				margin-top: auto;
			}
		`,
	];

	@state()
	private _users: Array<UserResponseModel> = [];

	@state()
	private _selection: Array<string> = [];

	@state()
	private _userGroups: Array<UserGroupEntity> = [];

	private _userGroupStore?: UmbUserGroupStore;

	#collectionContext?: UmbCollectionContext<UserResponseModel>;

	constructor() {
		super();

		this.consumeContext(UMB_USER_GROUP_STORE_CONTEXT_TOKEN, (instance) => {
			this._userGroupStore = instance;
			this._observeUserGroups();
		});

		this.consumeContext(UMB_COLLECTION_CONTEXT_TOKEN, (instance) => {
			this.#collectionContext = instance;
			this.observe(this.#collectionContext.selection, (selection) => (this._selection = selection));
			this.observe(this.#collectionContext.items, (items) => (this._users = items));
		});
	}

	private _observeUserGroups() {
		if (!this._userGroupStore) return;
	}

	private _isSelected(id: string) {
		return this._selection.includes(id);
	}

	//TODO How should we handle url stuff?
	private _handleOpenCard(id: string) {
		history.pushState(null, '', 'section/users/view/users/user/' + id); //TODO Change to a tag with href and make dynamic
	}

	#onSelect(user: UserEntity) {
		this.#collectionContext?.select(user.id);
	}

	#onDeselect(user: UserEntity) {
		this.#collectionContext?.deselect(user.id);
	}

	//TODO: Use this in render
	private _getUserGroupNames(ids: Array<string>) {
		return ids
			.map((id: string) => {
				return this._userGroups.find((x) => x.id === id)?.name;
			})
			.join(', ');
	}

	private renderUserCard(user: UserResponseModel) {
		const statusLook = getLookAndColorFromUserStatus(user.state);

		return html`
			<uui-card-user
				.name=${user.name}
				selectable
				?select-only=${this._selection.length > 0}
				?selected=${this._isSelected(user.id)}
				@open=${() => this._handleOpenCard(user.id)}
				@selected=${() => this.#onSelect(user)}
				@unselected=${() => this.#onDeselect(user)}>
				${user.status && user.status !== 'enabled'
					? html`<uui-tag
							slot="tag"
							size="s"
							look="${ifDefined(statusLook?.look)}"
							color="${ifDefined(statusLook?.color)}">
							${user.status}
					  </uui-tag>`
					: nothing}
				${user.lastLoginDate
					? html`<div class="user-login-time">
							<div>Last login</div>
							${user.lastLoginDate}
					  </div>`
					: html`<div class="user-login-time">${`${user.name} has not logged in yet`}</div>`}
			</uui-card-user>
		`;
	}

	render() {
		return html`
			<div id="user-grid">
				${repeat(
					this._users,
					(user) => user.id,
					(user) => this.renderUserCard(user)
				)}
			</div>
		`;
	}
}

export default UmbUserGridCollectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-grid-collection-view': UmbUserGridCollectionViewElement;
	}
}
