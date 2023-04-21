import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { css, html, nothing, TemplateResult } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { UmbCurrentUserStore, UMB_CURRENT_USER_STORE_CONTEXT_TOKEN } from '../../current-user/current-user.store';
import { UmbUserWorkspaceContext } from './user-workspace.context';
import { UMB_CHANGE_PASSWORD_MODAL } from '@umbraco-cms/backoffice/modal';
import type { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { getLookAndColorFromUserStatus } from '@umbraco-cms/backoffice/utils';
import type { UserDetails } from '@umbraco-cms/backoffice/models';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

import '../../../shared/components/input-user-group/input-user-group.element';
import '../../../shared/property-editors/uis/document-picker/property-editor-ui-document-picker.element';
import '../../../shared/components/workspace/workspace-layout/workspace-layout.element';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/context-api';
import { UserResponseModel, UserStateModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-user-workspace-edit')
export class UmbUserWorkspaceEditElement extends UmbLitElement {
	@state()
	private _currentUser?: UserDetails;

	private _currentUserStore?: UmbCurrentUserStore;
	private _modalContext?: UmbModalContext;

	private _languages = []; //TODO Add languages

	#workspaceContext?: UmbUserWorkspaceContext;

	@state()
	private _user?: UserResponseModel;

	@state()
	private _userName = '';

	constructor() {
		super();

		this.consumeContext(UMB_CURRENT_USER_STORE_CONTEXT_TOKEN, (store) => {
			this._currentUserStore = store;
			this._observeCurrentUser();
		});

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#workspaceContext = workspaceContext as UmbUserWorkspaceContext;
			this.#observeUser();
		});
	}

	#observeUser() {
		if (!this.#workspaceContext) return;

		this.#workspaceContext.data.subscribe((user) => {
			this._user = user;
		});
	}

	private async _observeCurrentUser() {
		if (!this._currentUserStore) return;

		// TODO: do not have static current user service, we need to make a ContextAPI for this.
		this.observe(this._currentUserStore.currentUser, (currentUser) => {
			this._currentUser = currentUser;
		});
	}

	private _updateUserStatus() {
		//TODO: Update user status
	}

	private _deleteUser() {
		//TODO: Delete user and redirect to user list.
	}

	// TODO. find a way where we don't have to do this for all workspaces.
	private _handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this._updateProperty('name', target.value);
			}
		}
	}

	private _updateProperty(propertyName: string, value: unknown) {
		this.#workspaceContext?.updateProperty(propertyName, value);
	}

	private _renderContentStartNodes() {
		if (!this._user || !this._user.contentStartNodeIds) return;

		if (this._user.contentStartNodeIds.length < 1)
			return html`
				<uui-ref-node name="Content Root">
					<uui-icon slot="icon" name="folder"></uui-icon>
				</uui-ref-node>
			`;

		//TODO Render the name of the content start node instead of it's id.
		return repeat(
			this._user.contentStartNodeIds,
			(node) => node,
			(node) => {
				return html`
					<uui-ref-node name=${node}>
						<uui-icon slot="icon" name="folder"></uui-icon>
					</uui-ref-node>
				`;
			}
		);
	}

	private _changePassword() {
		this._modalContext?.open(UMB_CHANGE_PASSWORD_MODAL, {
			requireOldPassword: this._currentUserStore?.isAdmin === false,
		});
	}

	private _renderActionButtons() {
		if (!this._user) return;

		const buttons: TemplateResult[] = [];

		if (this._currentUserStore?.isAdmin === false) return nothing;

		if (this._user?.state !== UserStateModel.INVITED)
			buttons.push(
				html`
					<uui-button
						@click=${this._updateUserStatus}
						look="primary"
						color="${this._user.state === UserStateModel.DISABLED ? 'positive' : 'warning'}"
						label="${this._user.state === UserStateModel.DISABLED ? 'Enable' : 'Disable'}"></uui-button>
				`
			);

		if (this._currentUser?.id !== this._user?.id)
			buttons.push(html` <uui-button
				@click=${this._deleteUser}
				look="primary"
				color="danger"
				label="Delete User"></uui-button>`);

		buttons.push(
			html` <uui-button @click=${this._changePassword} look="primary" label="Change password"></uui-button> `
		);

		return buttons;
	}

	private _renderLeftColumn() {
		if (!this._user) return nothing;

		return html` <uui-box>
				<div slot="headline">Profile</div>
				<umb-workspace-property-layout label="Email">
					<uui-input slot="editor" name="email" label="email" readonly value=${this._user.email}></uui-input>
				</umb-workspace-property-layout>
				<umb-workspace-property-layout label="Language">
					<uui-select slot="editor" name="language" label="language" .options=${this._languages}> </uui-select>
				</umb-workspace-property-layout>
			</uui-box>
			<uui-box>
				<div slot="headline">Assign access</div>
				<div id="assign-access">
					<umb-workspace-property-layout label="Groups" description="Add groups to assign access and permissions">
						<umb-input-user-group
							slot="editor"
							.value=${this._user.userGroupIds ?? []}
							@change=${(e: any) => this._updateProperty('userGroups', e.target.value)}></umb-input-user-group>
					</umb-workspace-property-layout>
					<umb-workspace-property-layout
						label="Content start node"
						description="Limit the content tree to specific start nodes">
						<umb-property-editor-ui-document-picker
							.value=${this._user.contentStartNodeIds}
							@property-editor-change=${(e: any) => this._updateProperty('contentStartNodes', e.target.value)}
							slot="editor"></umb-property-editor-ui-document-picker>
					</umb-workspace-property-layout>
					<umb-workspace-property-layout
						label="Media start nodes"
						description="Limit the media library to specific start nodes">
						<b slot="editor">NEED MEDIA PICKER</b>
					</umb-workspace-property-layout>
				</div>
			</uui-box>
			<uui-box headline="Access">
				<div slot="header" class="faded-text">
					Based on the assigned groups and start nodes, the user has access to the following nodes
				</div>

				<b>Content</b>
				${this._renderContentStartNodes()}
				<hr />
				<b>Media</b>
				<uui-ref-node name="Media Root">
					<uui-icon slot="icon" name="folder"></uui-icon>
				</uui-ref-node>
			</uui-box>`;
	}

	private _renderRightColumn() {
		if (!this._user || !this.#workspaceContext) return nothing;

		const statusLook = getLookAndColorFromUserStatus(this._user.state);

		return html` <uui-box>
			<div id="user-info">
				<uui-avatar .name=${this._user?.name || ''}></uui-avatar>
				<uui-button label="Change photo"></uui-button>
				<hr />
				${this._renderActionButtons()}
				<div>
					<b>Status:</b>
					<uui-tag look="${ifDefined(statusLook?.look)}" color="${ifDefined(statusLook?.color)}">
						${this._user.state}
					</uui-tag>
				</div>
				${this._user?.state === UserStateModel.INVITED
					? html`
							<uui-textarea placeholder="Enter a message..."> </uui-textarea>
							<uui-button look="primary" label="Resend invitation"></uui-button>
					  `
					: nothing}
				<div>
					<b>Last login:</b>
					<span>${this._user.lastLoginDate || `${this._user.name} has not logged in yet`}</span>
				</div>
				<div>
					<b>Failed login attempts</b>
					<span>${this._user.failedLoginAttempts}</span>
				</div>
				<div>
					<b>Last lockout date:</b>
					<span>${this._user.lastlockoutDate || `${this._user.name} has not been locked out`}</span>
				</div>
				<div>
					<b>Password last changed:</b>
					<span>${this._user.lastLoginDate || `${this._user.name} has not changed password`}</span>
				</div>
				<div>
					<b>User created:</b>
					<span>${this._user.createDate}</span>
				</div>
				<div>
					<b>User last updated:</b>
					<span>${this._user.updateDate}</span>
				</div>
				<div>
					<b>Key:</b>
					<span>${this._user.id}</span>
				</div>
			</div>
		</uui-box>`;
	}

	#renderHeader() {
		return html`
			<div id="header" slot="header">
				<a href="/section/users">
					<uui-icon name="umb:arrow-left"></uui-icon>
				</a>
				<uui-input id="name" .value=${this._user?.name ?? ''} @input="${this._handleInput}"></uui-input>
			</div>
		`;
	}

	render() {
		if (!this._user) return html`User not found`;

		return html`
			<umb-workspace-layout alias="Umb.Workspace.User">
				${this.#renderHeader()}
				<div id="main">
					<div id="left-column">${this._renderLeftColumn()}</div>
					<div id="right-column">${this._renderRightColumn()}</div>
				</div>
			</umb-workspace-layout>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				height: 100%;
			}

			#header {
				width: 100%;
				display: grid;
				grid-template-columns: var(--uui-size-layout-1) 1fr;
				padding: var(--uui-size-layout-1);
			}

			#main {
				display: grid;
				grid-template-columns: 1fr 350px;
				gap: var(--uui-size-layout-1);
				padding: var(--uui-size-layout-1);
			}

			#left-column {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-4);
			}
			#right-column > uui-box > div {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
			}
			uui-avatar {
				font-size: var(--uui-size-16);
				place-self: center;
			}
			hr {
				border: none;
				border-bottom: 1px solid var(--uui-color-divider);
				width: 100%;
			}
			uui-input {
				width: 100%;
			}
			.faded-text {
				color: var(--uui-color-text-alt);
				font-size: 0.8rem;
			}
			uui-tag {
				width: fit-content;
			}
			#user-info {
				display: flex;
				gap: var(--uui-size-space-6);
			}
			#user-info > div {
				display: flex;
				flex-direction: column;
			}
			#assign-access {
				display: flex;
				flex-direction: column;
			}
		`,
	];
}

export default UmbUserWorkspaceEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-workspace-edit': UmbUserWorkspaceEditElement;
	}
}
