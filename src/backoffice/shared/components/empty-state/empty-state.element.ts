import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('umb-empty-state')
export class UmbEmptyStateElement extends LitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				text-align: center;
				padding: var(--uui-size-space-4);
			}

			:host([position='center']) {
				position: absolute;
				top: 50%;
				left: 50%;
				max-width: 400px;
				width: 80%;
				transform: translate(-50%, -50%);
			}

			:host(:not([position='center'])) {
				margin: auto;
			}

			:host(:not([size='small'])) {
				font-size: var(--uui-size-6);
			}

			:host([size='small']) {
				font-size: var(--uui-size-5);
			}

			slot {
				margin: auto;
			}
		`,
	];

	/**
	 * Set the text size
	 */
	@property({ type: String })
	size: 'small' | 'large' = 'large';

	/**
	 * Set the element position
	 * 'center' => element is absolutely centered
	 * undefined => element has auto margin, to center in parent
	 */
	@property({ type: String })
	position: 'center' | undefined;

	render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-empty-state': UmbEmptyStateElement;
	}
}
