import { html, customElement, css, property, when, nothing, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UUIRefElement, UUIRefEvent, UUIRefNodeElement } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-ref-item')
export class UmbRefItemElement extends UmbElementMixin(UUIRefElement) {
	@property({ type: String })
	name = '';

	@property({ type: String })
	detail = '';

	@property({ type: String })
	icon = '';

	constructor() {
		super();

		this.selectable = true;

		this.addEventListener(UUIRefEvent.OPEN, () => this.dispatchEvent(new Event('click')));
	}

	public render() {
		return html`
			<button
				type="button"
				id="btn-item"
				tabindex="0"
				@click=${this.handleOpenClick}
				@keydown=${this.handleOpenKeydown}
				?disabled=${this.disabled}>
				${when(
					this.icon,
					() => html`<span id="icon"><uui-icon name=${this.icon ?? ''}></uui-icon></span>`,
					() => nothing,
				)}
				<div id="info">
					<div id="name">${this.name}</div>
					<small id="detail">${this.detail}</small>
				</div>
			</button>
			<div id="select-border"></div>
			<slot></slot>
		`;
	}

	static styles = [
		...UUIRefElement.styles,
		...UUIRefNodeElement.styles,
		css`
			:host {
				padding: calc(var(--uui-size-4) + 1px);
			}

			#btn-item {
				text-decoration: none;
				color: inherit;
				align-self: stretch;
				line-height: normal;

				display: flex;
				position: relative;
				align-items: center;
				cursor: pointer;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-ref-item': UmbRefItemElement;
	}
}
