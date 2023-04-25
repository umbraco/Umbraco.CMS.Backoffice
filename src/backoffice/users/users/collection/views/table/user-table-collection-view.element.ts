import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import {
	UmbTableElement,
	UmbTableColumn,
	UmbTableDeselectedEvent,
	UmbTableItem,
	UmbTableSelectedEvent,
	UmbTableConfig,
	UmbTableOrderedEvent,
} from '../../../../../shared/components/table/table.element';
import {
	UmbUserGroupStore,
	UMB_USER_GROUP_STORE_CONTEXT_TOKEN,
} from '../../../../user-groups/repository/user-group.store';
import {
	UMB_COLLECTION_CONTEXT_TOKEN,
	UmbCollectionContext,
} from '../../../../../shared/components/collection/collection.context';
import type { UserGroupEntity } from '@umbraco-cms/backoffice/models';

import './column-layouts/name/user-table-name-column-layout.element';
import './column-layouts/status/user-table-status-column-layout.element';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UserResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbUserCollectionContext } from '../../user-collection.context';

@customElement('umb-user-table-collection-view')
export class UmbUserTableCollectionViewElement extends UmbLitElement {
	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: true,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'userName',
			elementName: 'umb-user-table-name-column-layout',
		},
		{
			name: 'User group',
			alias: 'userGroup',
		},
		{
			name: 'Last login',
			alias: 'userLastLogin',
		},
		{
			name: 'Status',
			alias: 'userStatus',
			elementName: 'umb-user-table-status-column-layout',
		},
	];

	@state()
	private _tableItems: Array<UmbTableItem> = [];

	@state()
	private _userGroups: Array<UserGroupEntity> = [];

	private _userGroupStore?: UmbUserGroupStore;

	@state()
	private _users: Array<UserResponseModel> = [];

	@state()
	private _selection: Array<string> = [];

	#collectionContext?: UmbUserCollectionContext;

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
		this.observe(this._userGroupStore.getAll(), (userGroups) => {
			this._userGroups = userGroups;
			this._createTableItems(this._users);
		});
	}

	private _getUserGroupNames(ids: Array<string>) {
		return ids
			.map((id: string) => {
				return this._userGroups.find((x) => x.id === id)?.name;
			})
			.join(', ');
	}

	private _createTableItems(users: Array<UserResponseModel>) {
		this._tableItems = users.map((user) => {
			return {
				id: user.id ?? '',
				icon: 'umb:user',
				data: [
					{
						columnAlias: 'userName',
						value: {
							name: user.name,
						},
					},
					{
						columnAlias: 'userGroup',
						value: this._getUserGroupNames(user.userGroupIds ?? []),
					},
					{
						columnAlias: 'userLastLogin',
						value: user.lastLoginDate,
					},
					{
						columnAlias: 'userStatus',
						value: {
							status: user.state,
						},
					},
				],
			};
		});
	}

	private _handleSelected(event: UmbTableSelectedEvent) {
		event.stopPropagation();
		const table = event.target as UmbTableElement;
		const selection = table.selection;
		this.#collectionContext?.setSelection(selection);
	}

	private _handleDeselected(event: UmbTableDeselectedEvent) {
		event.stopPropagation();
		const table = event.target as UmbTableElement;
		const selection = table.selection;
		this.#collectionContext?.setSelection(selection);
	}

	private _handleOrdering(event: UmbTableOrderedEvent) {
		const table = event.target as UmbTableElement;
		const orderingColumn = table.orderingColumn;
		const orderingDesc = table.orderingDesc;
		console.log(`fetch users, order column: ${orderingColumn}, desc: ${orderingDesc}`);
	}

	render() {
		return html`
			<umb-table
				.config=${this._tableConfig}
				.columns=${this._tableColumns}
				.items=${this._tableItems}
				.selection=${this._selection}
				@selected="${this._handleSelected}"
				@deselected="${this._handleDeselected}"
				@ordered="${this._handleOrdering}"></umb-table>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}

			umb-table {
				padding: 0;
				margin: 0 var(--uui-size-layout-1) var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbUserTableCollectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-users-table': UmbUserTableCollectionViewElement;
	}
}
