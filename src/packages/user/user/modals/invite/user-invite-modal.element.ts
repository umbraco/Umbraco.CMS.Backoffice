import { UmbUserGroupInputElement } from '../../../user-group/components/input-user-group/user-group-input.element.js';
import { UmbInviteUserRepository } from '../../repository/invite/invite-user.repository.js';
import { css, html, nothing, customElement, query, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';

@customElement('umb-user-invite-modal')
export class UmbUserInviteModalElement extends UmbModalBaseElement {
	@query('#form')
	private _form!: HTMLFormElement;

	@state()
	private _invitedUser?: any;

	#userRepository = new UmbInviteUserRepository(this);

	private async _handleSubmit(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form) return;

		const isValid = form.checkValidity();
		if (!isValid) return;

		const formData = new FormData(form);

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		//TODO: How should we handle pickers forms?
		const userGroupPicker = form.querySelector('#userGroups') as UmbUserGroupInputElement;
		const userGroupIds = userGroupPicker?.selectedIds;

		const message = formData.get('message') as string;

		alert('implement');

		// TODO: figure out when to use email or username
		// TODO: invite request gives 500 error.
		/*
		const { data } = await this.#userRepository.invite({
			name,
			email,
			userName: email,
			message,
			userGroupIds,
		});

		if (data) {
			this._invitedUser = data;
		}
		*/
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private _closeModal() {
		this.modalContext?.reject();
	}

	private _resetForm() {
		this._invitedUser = undefined;
	}

	private _goToProfile() {
		if (!this._invitedUser) return;

		this._closeModal();
		history.pushState(null, '', 'section/user-management/view/users/user/' + this._invitedUser?.id); //TODO: URL Should be dynamic
	}

	private _renderForm() {
		return html` <h1>Invite user</h1>
			<p style="margin-top: 0">
				Invite new users to give them access to Umbraco. An invite email will be sent to the user with information on
				how to log in to Umbraco. Invites last for 72 hours.
			</p>
			<uui-form>
				<form id="form" name="form" @submit="${this._handleSubmit}">
					<uui-form-layout-item>
						<uui-label id="nameLabel" slot="label" for="name" required>Name</uui-label>
						<uui-input id="name" label="name" type="text" name="name" required></uui-input>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label id="emailLabel" slot="label" for="email" required>Email</uui-label>
						<uui-input id="email" label="email" type="email" name="email" required></uui-input>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label id="userGroupsLabel" slot="label" for="userGroups" required>User group</uui-label>
						<span slot="description">Add groups to assign access and permissions</span>
						<umb-user-group-input id="userGroups" name="userGroups"></umb-user-group-input>
					</uui-form-layout-item>
					<uui-form-layout-item>
						<uui-label id="messageLabel" slot="label" for="message" required>Message</uui-label>
						<uui-textarea id="message" label="message" name="message" required></uui-textarea>
					</uui-form-layout-item>
				</form>
			</uui-form>`;
	}

	private _renderPostInvite() {
		if (!this._invitedUser) return nothing;

		return html`<div>
			<h1><b style="color: var(--uui-color-interactive-emphasis)">${this._invitedUser.name}</b> has been invited</h1>
			<p>An invitation has been sent to the new user with details about how to log in to Umbraco.</p>
		</div>`;
	}

	render() {
		return html`<uui-dialog-layout>
			${this._invitedUser ? this._renderPostInvite() : this._renderForm()}
			${this._invitedUser
				? html`
						<uui-button
							@click=${this._closeModal}
							style="margin-right: auto"
							slot="actions"
							label="Close"
							look="secondary"></uui-button>
						<uui-button
							@click=${this._resetForm}
							slot="actions"
							label="Invite another user"
							look="secondary"></uui-button>
						<uui-button @click=${this._goToProfile} slot="actions" label="Go to profile" look="primary"></uui-button>
				  `
				: html`
						<uui-button
							@click=${this._closeModal}
							style="margin-right: auto"
							slot="actions"
							label="Cancel"
							look="secondary"></uui-button>
						<uui-button
							@click="${this._submitForm}"
							slot="actions"
							type="submit"
							label="Send invite"
							look="primary"></uui-button>
				  `}
		</uui-dialog-layout>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 100%;
			}
			uui-box {
				max-width: 500px;
			}
			uui-form-layout-item {
				display: flex;
				flex-direction: column;
			}
			uui-input {
				width: 100%;
			}
			form {
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
			}
			uui-form-layout-item {
				margin-bottom: 0;
			}
			uui-textarea {
				--uui-textarea-min-height: 100px;
			}
			/* TODO: Style below is to fix a11y contrast issue, find a proper solution */
			[slot='description'] {
				color: black;
			}
		`,
	];
}

export default UmbUserInviteModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-invite-modal': UmbUserInviteModalElement;
	}
}
