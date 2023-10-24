import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('umb-auth-layout')
export class UmbAuthLayoutElement extends LitElement {
	render() {
		return html`
			<div id="layout">
				<div id="image-column">
					<div id="logo">
						<img src="umbraco_logo_white_horizontal.svg" alt="Umbraco" />
					</div>
					<div id="image"></div>
				</div>
				<div id="auth-column">
					<div id="auth-box">
						<slot></slot>
					</div>
				</div>
			</div>
			<!-- <div id="background"></div>

			<div id="container">
				<div>
					<div id="image"></div>
				</div>
				<uui-box id="box">
					<slot></slot>
				</uui-box>
			</div> -->
		`;
	}

	static styles: CSSResultGroup = [
		css`
			@media (max-width: 800px) {
				#image-column {
					display: none;
				}
			}
			:host {
				display: block;
				height: 100dvh;
				background-color: white;
			}
			#layout {
				display: flex;
				height: 100%;
			}
			#image-column {
				width: 100%;
				overflow: hidden;
				position: relative;
				padding: 32px;
				padding-right: 0;
				box-sizing: border-box;
			}
			#logo {
				position: fixed;
				width: 140px;
				z-index: 1;
				top: 48px;
				left: 48px;
			}
			#auth-column {
				display: flex;
				width: 100%;
				height: 100%;
				max-height: calc(50% + 200px);
				padding: 32px;
				box-sizing: border-box;
				margin-block: auto;
			}
			#image {
				z-index: 0;
				overflow: hidden;
				background-position: 50%;
				background-repeat: no-repeat;
				background-size: cover;
				background-image: url('loginImage.jpg');
				width: 100%;
				height: 100%;
				transform: scaleX(-1);
				border-radius: 32px;
			}
			#auth-box {
				max-width: 300px;
				width: 100%;
				box-sizing: border-box;
				margin-inline: auto;
			}
			/* 

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
				width: 500px;
				padding: var(--uui-size-space-6) var(--uui-size-space-5) var(--uui-size-space-5) var(--uui-size-space-5);
			}

			#email,
			#password {
				width: 100%;
			} */
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-auth-layout': UmbAuthLayoutElement;
	}
}
