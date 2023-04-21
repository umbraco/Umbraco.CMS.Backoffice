import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
	UMB_COLLECTION_CONTEXT_TOKEN,
	UmbCollectionContext,
} from '../../../../../shared/components/collection/collection.context';
import { getLookAndColorFromUserStatus } from '@umbraco-cms/backoffice/utils';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UserResponseModel, UserStateModel } from '@umbraco-cms/backoffice/backend-api';

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

	#collectionContext?: UmbCollectionContext<UserResponseModel>;

	constructor() {
		super();

		//TODO: Get user group names

		this.consumeContext(UMB_COLLECTION_CONTEXT_TOKEN, (instance) => {
			this.#collectionContext = instance;
			this.observe(this.#collectionContext.selection, (selection) => (this._selection = selection));
			this.observe(this.#collectionContext.items, (items) => (this._users = items));
		});
	}

	//TODO How should we handle url stuff?
	private _handleOpenCard(id: string) {
		//TODO this will not be needed when cards works as links with href
		history.pushState(null, '', 'section/users/view/users/user/' + id); //TODO Change to a tag with href and make dynamic
	}

	#onSelect(user: UserResponseModel) {
		this.#collectionContext?.select(user.id ?? '');
	}

	#onDeselect(user: UserResponseModel) {
		this.#collectionContext?.deselect(user.id ?? '');
	}

	#renderUserCard(user: UserResponseModel) {
		return html`
			<uui-card-user
				.name=${user.name}
				selectable
				?select-only=${this._selection.length > 0}
				?selected=${this.#collectionContext?.isSelected(user.id ?? '')}
				@open=${() => this._handleOpenCard(user.id ?? '')}
				@selected=${() => this.#onSelect(user)}
				@unselected=${() => this.#onDeselect(user)}>
				${this.#renderUserTag(user)} ${this.#renderUserLoginDate(user)}
			</uui-card-user>
		`;
	}

	#renderUserTag(user: UserResponseModel) {
		if (user.state || user.state === UserStateModel.ACTIVE) {
			return nothing;
		}

		const statusLook = getLookAndColorFromUserStatus(user.state);
		return html`<uui-tag
			slot="tag"
			size="s"
			look="${ifDefined(statusLook?.look)}"
			color="${ifDefined(statusLook?.color)}">
			${user.state}
		</uui-tag>`;
	}

	#renderUserLoginDate(user: UserResponseModel) {
		if (!user.lastLoginDate) {
			return html`<div class="user-login-time">${`${user.name} has not logged in yet`}</div>`;
		}

		return html`<div class="user-login-time">
			<div>Last login</div>
			${user.lastLoginDate}
		</div>`;
	}

	render() {
		return html`
			<div id="user-grid">
				${repeat(
					this._users,
					(user) => user.id,
					(user) => this.#renderUserCard(user)
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
