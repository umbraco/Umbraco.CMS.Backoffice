import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { css, html, nothing, TemplateResult } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { UmbCurrentUserStore, UMB_CURRENT_USER_STORE_CONTEXT_TOKEN } from '../../current-user/current-user.store';
import { getLookAndColorFromUserStatus } from '../../utils';
import { UmbUserWorkspaceContext } from './user-workspace.context';
import { UMB_CHANGE_PASSWORD_MODAL } from '@umbraco-cms/backoffice/modal';
import type { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/context-api';
import { UserResponseModel, UserStateModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-user-workspace-edit')
export class UmbUserWorkspaceEditElement extends UmbLitElement {
	@state()
	private _currentUser?: any;

	@state()
	private _user?: UserResponseModel;

	#currentUserStore?: UmbCurrentUserStore;
	#modalContext?: UmbModalContext;
	#languages = []; //TODO Add languages
	#workspaceContext?: UmbUserWorkspaceContext;

	constructor() {
		super();

		this.consumeContext(UMB_CURRENT_USER_STORE_CONTEXT_TOKEN, (store) => {
			this.#currentUserStore = store;
			this.#observeCurrentUser();
		});

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#workspaceContext = workspaceContext as UmbUserWorkspaceContext;
			this.#observeUser();
		});
	}

	#observeUser() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.data, (user) => (this._user = user));
	}

	#observeCurrentUser() {
		if (!this.#currentUserStore) return;
		this.observe(this.#currentUserStore.currentUser, (currentUser) => (this._currentUser = currentUser));
	}

	#onUserStatusChange() {
		if (!this._user) return;

		if (this._user.state === UserStateModel.ACTIVE) {
			//TODO: This should go directly to the user repository instead of the context so that the request is send immediately.
			this.#workspaceContext?.updateProperty('state', UserStateModel.DISABLED);
		}

		if (this._user.state === UserStateModel.DISABLED) {
			//TODO: This should go directly to the user repository instead of the context so that the request is send immediately.
			this.#workspaceContext?.updateProperty('state', UserStateModel.ACTIVE);
		}
	}

	#onUserDelete() {
		//TODO: Delete user and redirect to user list.
	}

	// TODO. find a way where we don't have to do this for all workspaces.
	#onNameChange(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.updateProperty('name', target.value);
			}
		}
	}

	#onPasswordChange() {
		// TODO: check if current user is admin
		this.#modalContext?.open(UMB_CHANGE_PASSWORD_MODAL, {
			requireOldPassword: false,
		});
	}

	render() {
		if (!this._user) return html`User not found`;

		return html`
			<umb-workspace-editor alias="Umb.Workspace.User">
				${this.#renderHeader()}
				<div id="main">
					<div id="left-column">${this.#renderLeftColumn()}</div>
					<div id="right-column">${this.#renderRightColumn()}</div>
				</div>
			</umb-workspace-editor>
		`;
	}

	#renderHeader() {
		return html`
			<div id="header" slot="header">
				<a href="/section/users">
					<uui-icon name="umb:arrow-left"></uui-icon>
				</a>
				<uui-input id="name" .value=${this._user?.name ?? ''} @input="${this.#onNameChange}"></uui-input>
			</div>
		`;
	}

	#renderLeftColumn() {
		if (!this._user) return nothing;

		return html` <uui-box>
				<div slot="headline">Profile</div>
				<umb-workspace-property-layout label="Email">
					<uui-input slot="editor" name="email" label="email" readonly value=${this._user.email}></uui-input>
				</umb-workspace-property-layout>
				<umb-workspace-property-layout label="Language">
					<uui-select slot="editor" name="language" label="language" .options=${this.#languages}> </uui-select>
				</umb-workspace-property-layout>
			</uui-box>
			<uui-box>
				<div slot="headline">Assign access</div>
				<div id="assign-access">
					<umb-workspace-property-layout label="Groups" description="Add groups to assign access and permissions">
						<umb-input-user-group
							slot="editor"
							.value=${this._user.userGroupIds ?? []}
							@change=${(e: any) =>
								this.#workspaceContext?.updateProperty('userGroupIds', e.target.value)}></umb-input-user-group>
					</umb-workspace-property-layout>
					<umb-workspace-property-layout
						label="Content start node"
						description="Limit the content tree to specific start nodes">
						<umb-property-editor-ui-document-picker
							.value=${this._user.contentStartNodeIds}
							@property-value-change=${(e: any) =>
								this.#workspaceContext?.updateProperty('contentStartNodeIds', e.target.value)}
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
				${this.#renderContentStartNodes()}
				<hr />
				<b>Media</b>
				<uui-ref-node name="Media Root">
					<uui-icon slot="icon" name="folder"></uui-icon>
				</uui-ref-node>
			</uui-box>`;
	}

	#renderRightColumn() {
		if (!this._user || !this.#workspaceContext) return nothing;

		const statusLook = getLookAndColorFromUserStatus(this._user.state);

		return html` <uui-box>
			<div id="user-info">
				<uui-avatar .name=${this._user?.name || ''}></uui-avatar>
				<uui-button label="Change photo"></uui-button>
				<hr />
				${this.#renderActionButtons()}

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
				${this.#renderInfoItem('Last login', this._user.lastLoginDate || `${this._user.name} has not logged in yet`)}
				${this.#renderInfoItem('Failed login attempts', this._user.failedLoginAttempts)}
				${this.#renderInfoItem(
					'Last lockout date',
					this._user.lastlockoutDate || `${this._user.name} has not been locked out`
				)}
				${this.#renderInfoItem(
					'Password last changed',
					this._user.lastLoginDate || `${this._user.name} has not changed password`
				)}
				${this.#renderInfoItem('User created', this._user.createDate)}
				${this.#renderInfoItem('User last updated', this._user.updateDate)}
				${this.#renderInfoItem('Key', this._user.id)}
			</div>
		</uui-box>`;
	}

	#renderInfoItem(label: string, value?: string | number) {
		return html`
			<div>
				<b>${label}</b>
				<span>${value}</span>
			</div>
		`;
	}

	#renderActionButtons() {
		if (!this._user) return nothing;

		//TODO: Find out if the current user is an admin. If not, show no buttons.
		// if (this._currentUserStore?.isAdmin === false) return nothing;

		const buttons: TemplateResult[] = [];

		if (this._user.state !== UserStateModel.INVITED) {
			const button = html`
				<uui-button
					@click=${this.#onUserStatusChange}
					look="primary"
					color="${this._user.state === UserStateModel.DISABLED ? 'positive' : 'warning'}"
					label="${this._user.state === UserStateModel.DISABLED ? 'Enable' : 'Disable'}"></uui-button>
			`;

			buttons.push(button);
		}

		if (this._currentUser?.id !== this._user?.id) {
			const button = html`
				<uui-button @click=${this.#onUserDelete} look="primary" color="danger" label="Delete User"></uui-button>
			`;

			buttons.push(button);
		}

		buttons.push(
			html`<uui-button @click=${this.#onPasswordChange} look="primary" label="Change password"></uui-button>`
		);

		return buttons;
	}

	#renderContentStartNodes() {
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
