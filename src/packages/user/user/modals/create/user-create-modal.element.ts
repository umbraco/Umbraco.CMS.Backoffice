import { UmbUserDetailRepository } from '../../repository/index.js';
import { type UmbUserGroupInputElement } from '@umbraco-cms/backoffice/user-group';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, query } from '@umbraco-cms/backoffice/external/lit';
import {
	UmbModalBaseElement,
	UMB_MODAL_MANAGER_CONTEXT,
	UMB_CREATE_USER_SUCCESS_MODAL,
	UmbModalManagerContext,
} from '@umbraco-cms/backoffice/modal';

@customElement('umb-user-create-modal')
export class UmbUserCreateModalElement extends UmbModalBaseElement {
	#userDetailRepository = new UmbUserDetailRepository(this);
	#modalManagerContext?: UmbModalManagerContext;

	@query('#CreateUserForm')
	_form?: HTMLFormElement;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
			this.#modalManagerContext = _instance;
		});
	}

	async #onSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form) return;

		const isValid = form.checkValidity();
		if (!isValid) return;

		const formData = new FormData(form);

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		const userGroupPicker = form.querySelector('#userGroups') as UmbUserGroupInputElement;
		const userGroups = userGroupPicker?.selectedIds;

		// TODO: figure out when to use email or username
		const { data } = await this.#userDetailRepository.create({
			name,
			email,
			userName: email,
			userGroupIds: userGroups,
		});

		if (data && data.userId && data.initialPassword) {
			this.#openSuccessModal(data.userId, data.initialPassword);
		}
	}

	#openSuccessModal(userId: string, initialPassword: string) {
		const modalContext = this.#modalManagerContext?.open(UMB_CREATE_USER_SUCCESS_MODAL, {
			data: {
				userId,
				initialPassword,
			},
		});

		modalContext?.onSubmit().catch((reason) => {
			if (reason?.type === 'createAnotherUser') {
				this._form?.reset();
			} else {
				this.#closeModal();
			}
		});
	}

	#closeModal() {
		this.modalContext?.reject();
	}

	render() {
		return html`<uui-dialog-layout headline="Create user">
			<p>
				Create new users to give them access to Umbraco. When a user is created a password will be generated that you
				can share with the user.
			</p>

			${this.#renderForm()}
			<uui-button @click=${this.#closeModal} slot="actions" label="Cancel" look="secondary"></uui-button>
			<uui-button
				form="CreateUserForm"
				slot="actions"
				type="submit"
				label="Create user"
				look="primary"
				color="positive"></uui-button>
		</uui-dialog-layout>`;
	}

	#renderForm() {
		return html` <uui-form>
			<form id="CreateUserForm" name="form" @submit="${this.#onSubmit}">
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
			</form>
		</uui-form>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-input,
			uui-input-password {
				width: 100%;
			}

			p {
				width: 580px;
			}

			uui-textarea {
				--uui-textarea-min-height: 100px;
			}
		`,
	];
}

export default UmbUserCreateModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-create-modal': UmbUserCreateModalElement;
	}
}
