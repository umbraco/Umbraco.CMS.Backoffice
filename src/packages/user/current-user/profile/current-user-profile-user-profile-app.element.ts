import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_CHANGE_PASSWORD_MODAL, UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_CURRENT_USER_CONTEXT, type UmbCurrentUserModel } from '@umbraco-cms/backoffice/current-user';

@customElement('umb-current-user-profile-user-profile-app')
export class UmbCurrentUserProfileUserProfileAppElement extends UmbLitElement {
	@state()
	private _currentUser?: UmbCurrentUserModel;

	#currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
			this.#currentUserContext = instance;
			this._observeCurrentUser();
		});
	}

	private async _observeCurrentUser() {
		if (!this.#currentUserContext) return;

		this.observe(
			this.#currentUserContext.currentUser,
			(currentUser) => {
				this._currentUser = currentUser;
			},
			'umbCurrentUserObserver',
		);
	}

	private _edit() {
		if (!this._currentUser) return;

		history.pushState(null, '', 'section/user-management/view/users/user/' + this._currentUser.unique); //TODO Change to a tag with href and make dynamic
		//TODO Implement modal routing for the current-user-modal, so that the modal closes when navigating to the edit profile page
	}
	async #changePassword() {
		if (!this._currentUser) throw new Error('Current User not found');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		modalManager.open(this, UMB_CHANGE_PASSWORD_MODAL, {
			data: {
				user: {
					unique: this._currentUser.unique,
				},
			},
		});
	}

	render() {
		return html`
			<uui-box .headline=${this.localize.term('user_yourProfile')}>
				<uui-button look="primary" label=${this.localize.term('general_edit')} @click=${this._edit}>
					${this.localize.term('general_edit')}
				</uui-button>
				<uui-button look="primary" label=${this.localize.term('general_changePassword')} @click=${this.#changePassword}>
					${this.localize.term('general_changePassword')}
				</uui-button>
			</uui-box>
		`;
	}
}

export default UmbCurrentUserProfileUserProfileAppElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-current-user-profile-user-profile-app': UmbCurrentUserProfileUserProfileAppElement;
	}
}
