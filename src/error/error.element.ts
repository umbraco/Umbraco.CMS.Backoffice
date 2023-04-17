import { css, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

import logoImg from '/umbraco_logomark_white.svg';
import loginImg from '/login.jpeg';

/**
 * A full page error element that can be used either solo or for instance as the error 500 page and BootFailed
 */
@customElement('umb-error')
export class UmbErrorElement extends UmbLitElement {
	/**
	 * The error message to display
	 *
	 * @attr
	 */
	@property()
	errorMessage?: string;

	/**
	 * The error to display
	 *
	 * @attr
	 */
	@property()
	error?: Error;

	static styles = css`
		#background {
			position: fixed;
			overflow: hidden;
			background-position: 50%;
			background-repeat: no-repeat;
			background-size: cover;
			background-image: url('${unsafeCSS(loginImg)}');
			width: 100vw;
			height: 100vh;
		}

		#logo {
			position: fixed;
			top: var(--uui-size-space-5);
			left: var(--uui-size-space-5);
			height: 30px;
		}

		#logo img {
			height: 100%;
		}

		#container {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100vw;
			height: 100vh;
		}

		#box {
			width: 50vw;
			padding: var(--uui-size-space-6) var(--uui-size-space-5) var(--uui-size-space-5) var(--uui-size-space-5);
		}

		pre {
			width: 100%;
			overflow: auto;
		}
	`;

	render = () => html`
		<div id="background"></div>

		<div id="logo">
			<img src="${logoImg}" alt="Umbraco" />
		</div>

		<div id="container">
			<uui-box id="box">
				<h1>Something went wrong</h1>
				<p>${this.errorMessage}</p>
				${this.error
					? html`
							<details>
								<summary>Details</summary>
								<p><strong>Name:</strong> ${this.error.name}</p>
								<p><strong>Stack:</strong></p>
								<pre>${this.error?.stack}</pre>
							</details>
					  `
					: nothing}
			</uui-box>
		</div>
	`;
}

export default UmbErrorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-error': UmbErrorElement;
	}
}
