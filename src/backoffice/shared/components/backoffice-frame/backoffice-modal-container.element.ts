import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, CSSResultGroup, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbModalHandler, UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '../../../../core/modal';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-backoffice-modal-container')
export class UmbBackofficeModalContainer extends UmbLitElement {
	static styles: CSSResultGroup = [
		UUITextStyles,
		css`
			:host {
				position: absolute;
			}
		`,
	];

	@state()
	private _modals?: UmbModalHandler[];

	private _modalContext?: UmbModalContext;

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
			this._observeModals();
		});
	}

	private _observeModals() {
		if (!this._modalContext) return;

		this.observe(this._modalContext.modals, (modals) => {
			this._modals = modals;
		});
	}

	render() {
		return html`
			<uui-modal-container>
				${this._modals ? repeat(this._modals, (modalHandler) => html`${modalHandler.element}`) : ''}
			</uui-modal-container>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-backoffice-modal-container': UmbBackofficeModalContainer;
	}
}
