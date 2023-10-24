import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('umb-auth-layout')
export class UmbAuthLayoutElement extends LitElement {
	render() {
		return html`
			<div id="layout">
				<div id="logo"></div>
				<div id="image-column">
					<div id="image"></div>
				</div>
				<div id="auth-column">
					<div id="auth-box">
						<slot></slot>
					</div>
				</div>
			</div>
		`;
	}

	static styles: CSSResultGroup = [
		css`
			@media (max-width: 800px) {
				#layout #image-column {
					display: none;
					padding: var(--uui-size-layout-2);
					top: 48px;
					left: 48px;
				}
				#layout #logo {
					background-image: url('umbraco_logo_blue_horizontal.svg');
					width: 80px;
					height: 22px;
					top: var(--uui-size-space-4);
					left: var(--uui-size-space-4);
				}
				#layout #auth-column {
					padding-inline: var(--uui-size-space-4);
					max-height: calc(50% + 100px);
				}
			}
			@media (max-width: 1200px) {
				#layout #image-column {
					padding: var(--uui-size-layout-2);
				}
			}
			@media (min-width: 1200px) {
				#layout #image-column {
					padding: var(--uui-size-layout-2);
				}
				#layout #auth-column {
					padding-inline: var(--uui-size-space-4);
					max-width: 600px;
				}
			}

			:host {
				display: block;
				height: 100dvh;
			}
			#layout {
				display: flex;
				height: 100%;
			}
			#image-column {
				width: 100%;
				overflow: hidden;
				padding: var(--uui-size-layout-3);
				padding-right: 0;
				box-sizing: border-box;
				overflow: visible;
			}
			#logo {
				position: fixed;
				background-image: url('umbraco_logo_white_horizontal.svg');
				background-repeat: no-repeat;
				width: 140px;
				height: 39px;
				z-index: 1;
				top: 64px;
				left: 64px;
			}
			#auth-column {
				display: flex;
				width: 100%;
				height: 100%;
				max-height: calc(50% + 200px);
				box-sizing: border-box;
				margin-block: auto;
				padding-block: var(--uui-size-layout-2);
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
				border-radius: 26px;
				border: 1px solid white;
				box-sizing: border-box;
				box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 48px;
			}
			#auth-box {
				max-width: 300px;
				width: 100%;
				box-sizing: border-box;
				margin-inline: auto;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-auth-layout': UmbAuthLayoutElement;
	}
}
