import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-history-ui-node')
export class UmbHistoryUINodeElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				--avatar-size: calc(2em + 4px);
				display: block;
			}

			#wrapper {
				display: flex;
				width: 100%;
				gap: calc(2 * var(--uui-size-space-5));
				align-items: center;
			}
			.slots-wrapper {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex: 1;
			}

			#actions-container {
				display: block;
				opacity: 0;
				transition: opacity 120ms;
			}
			:host(:hover) #actions-container {
				opacity: 1;
			}

			.user-info {
				display: flex;
				align-items: center;
				gap: var(--uui-size-space-5);
			}
			.user-info div {
				display: flex;
				flex-direction: column;
			}
			.detail {
				font-size: var(--uui-size-4);
				color: var(--uui-color-text-alt);
				line-height: 1;
			}
		`,
	];

	@property({ type: String })
	src?: string;

	@property({ type: String })
	name?: string;

	@property({ type: String })
	detail?: string;

	render() {
		return html`<div id="wrapper">
			<div class="user-info">
				<uui-avatar .name="${this.name ?? 'Unknown'}" ?src="${this.src}"></uui-avatar>
				<div>
					<span class="name">${this.name}</span>
					<span class="detail">${this.detail}</span>
				</div>
			</div>
			<div class="slots-wrapper">
				<slot id="description"></slot>
				<slot id="actions-container" name="actions"></slot>
			</div>
		</div>`;
	}
}

export default UmbHistoryUINodeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-history-ui-node': UmbHistoryUINodeElement;
	}
}
