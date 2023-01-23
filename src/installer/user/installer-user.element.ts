import { css, CSSResultGroup, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbInstallerContext, UMB_INSTALLER_CONTEXT_TOKEN } from '../installer.context';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-installer-user')
export class UmbInstallerUserElement extends UmbLitElement {
	static styles: CSSResultGroup = [
		css`
			:host,
			#container {
				display: flex;
				flex-direction: column;
				height: 100%;
			}

			uui-form-layout-item {
				margin-top: 0;
				margin-bottom: var(--uui-size-space-6);
			}

			uui-form {
				height: 100%;
			}

			form {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			uui-input,
			uui-input-password {
				width: 100%;
			}

			h1 {
				text-align: center;
				margin-bottom: var(--uui-size-layout-3);
			}

			#news-checkbox {
				margin-top: var(--uui-size-space-4);
			}

			#buttons {
				display: flex;
				margin-top: auto;
			}

			#button-install {
				margin-left: auto;
				min-width: 120px;
			}
		`,
	];

	@state()
	private _userFormData?: { name: string; password: string; email: string; subscribeToNewsletter: boolean };

	private _installerContext?: UmbInstallerContext;

	constructor() {
		super();

		this.consumeContext(UMB_INSTALLER_CONTEXT_TOKEN, (installerContext) => {
			this._installerContext = installerContext;
			this._observeInstallerData();
		});
	}

	private _observeInstallerData() {
		if (!this._installerContext) return;

		this.observe(this._installerContext.data, ({ user }) => {
			this._userFormData = {
				name: user.name,
				password: user.password,
				email: user.email,
				subscribeToNewsletter: user.subscribeToNewsletter ?? false,
			};
		});
	}

	private _handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form) return;

		const isValid = form.checkValidity();
		if (!isValid) return;

		const formData = new FormData(form);
		const name = formData.get('name') as string;
		const password = formData.get('password') as string;
		const email = formData.get('email') as string;
		const subscribeToNewsletter = formData.has('subscribeToNewsletter');

		this._installerContext?.appendData({ user: { name, password, email, subscribeToNewsletter } });
		this._installerContext?.nextStep();
	};

	render() {
		return html` <div id="container" class="uui-text" data-test="installer-user">
			<h1>Install Umbraco</h1>
			<uui-form>
				<form id="LoginForm" name="login" @submit="${this._handleSubmit}">
					<uui-form-layout-item>
						<uui-label id="nameLabel" for="name" slot="label" required>Name</uui-label>
						<uui-input
							type="text"
							id="name"
							.value=${this._userFormData?.name}
							name="name"
							label="name"
							required
							required-message="Name is required"></uui-input>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label id="emailLabel" for="email" slot="label" required>Email</uui-label>
						<uui-input
							type="email"
							id="email"
							.value=${this._userFormData?.email}
							name="email"
							label="email"
							required
							required-message="Email is required"></uui-input>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label id="passwordLabel" for="password" slot="label" required>Password</uui-label>
						<uui-input-password
							id="password"
							name="password"
							label="password"
							.value=${this._userFormData?.password}
							required
							required-message="Password is required"></uui-input-password>
					</uui-form-layout-item>

					<uui-form-layout-item id="news-checkbox">
						<uui-checkbox
							name="subscribeToNewsletter"
							label="Remember me"
							.checked=${this._userFormData?.subscribeToNewsletter || false}>
							Keep me updated on Umbraco Versions, Security Bulletins and Community News
						</uui-checkbox>
					</uui-form-layout-item>

					<div id="buttons">
						<uui-button id="button-install" type="submit" label="Next" look="primary"></uui-button>
					</div>
				</form>
			</uui-form>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-installer-user': UmbInstallerUserElement;
	}
}
