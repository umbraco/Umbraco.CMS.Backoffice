import { UmbLitElement } from '../../lit-element/index.js';
import type { UmbAuthProviderDefaultProps } from '../types.js';
import { UmbTextStyles } from '../../style/index.js';
import type { ManifestAuthProvider } from '../../extension-registry/models/index.js';
import { css, customElement, html, property, state } from '@umbraco-cms/backoffice/external/lit';

@customElement('umb-auth-provider-umbraco')
export class UmbAuthProviderUmbracoElement extends UmbLitElement implements UmbAuthProviderDefaultProps {
	@property({ attribute: false })
	manifest!: ManifestAuthProvider;

	@property({ attribute: false })
	onSubmit!: (providerName: string, loginHint?: string) => void;

	@state()
	_usernameError?: string;

	connectedCallback(): void {
		super.connectedCallback();
		this.setAttribute('part', 'auth-provider-umbraco');
	}

	#onSubmit(evt: SubmitEvent) {
		evt.preventDefault();
		this._usernameError = undefined;

		const form = evt.target as HTMLFormElement;
		const formData = new FormData(form);

		const username = formData.get('username') as string;

		if (!username) {
			this._usernameError = 'Username is required';
			return;
		}

		this.onSubmit(this.manifest.forProviderName, username);
	}

	render() {
		return html`
			<uui-form>
				<form @submit=${this.#onSubmit}>
					<uui-form-layout-item>
						<uui-label slot="label" for="username" required>Username</uui-label>
						<uui-input
							type="text"
							id="username"
							name="username"
							style="width:100%"
							required
							.requiredMessage=${this._usernameError}></uui-input>
					</uui-form-layout-item>
					<uui-button type="submit" id="auth-provider-button" label="Next" look="primary"></uui-button>
				</form>
			</uui-form>
			<div id="or-divider">or</div>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
			}

			#auth-provider-button {
				width: 100%;
			}

			#or-divider {
				display: flex;
				align-items: center;
				margin: var(--uui-size-space-4) 0 0;
			}

			#or-divider::before,
			#or-divider::after {
				content: '';
				flex: 1;
				border-bottom: 1px solid var(--uui-color-divider-emphasis);
			}

			#or-divider::before {
				margin-right: 16px;
			}

			#or-divider::after {
				margin-left: 16px;
			}
		`,
	];
}

export default UmbAuthProviderUmbracoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-auth-provider-umbraco': UmbAuthProviderUmbracoElement;
	}
}
