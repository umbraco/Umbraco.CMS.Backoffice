import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, CSSResultGroup, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbCurrentUserStore, UMB_CURRENT_USER_STORE_CONTEXT_TOKEN } from './current-user.store';
import type { UserDetails } from '@umbraco-cms/backoffice/models';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN, UMB_CURRENT_USER_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-current-user-header-app')
export class UmbCurrentUserHeaderAppElement extends UmbLitElement {
	

	@state()
	private _currentUser?: UserDetails;

	private _currentUserStore?: UmbCurrentUserStore;
	private _modalContext?: UmbModalContext;

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});

		this.consumeContext(UMB_CURRENT_USER_STORE_CONTEXT_TOKEN, (instance) => {
			this._currentUserStore = instance;
			this._observeCurrentUser();
		});
	}

	private async _observeCurrentUser() {
		if (!this._currentUserStore) return;

		this.observe(this._currentUserStore.currentUser, (currentUser) => {
			this._currentUser = currentUser;
		});
	}

	private _handleUserClick() {
		this._modalContext?.open(UMB_CURRENT_USER_MODAL);
	}

	render() {
		return html`
			<uui-button @click=${this._handleUserClick} look="primary" label="${this._currentUser?.name || ''}" compact>
				<uui-avatar name="${this._currentUser?.name || ''}"></uui-avatar>
			</uui-button>
		`;
	}
	
	static styles: CSSResultGroup = [
		UUITextStyles,
		css`
			uui-button {
				font-size: 14px;
				--uui-button-background-color: transparent;
			}
		`,
	];
}

export default UmbCurrentUserHeaderAppElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-current-user-header-app': UmbCurrentUserHeaderAppElement;
	}
}
