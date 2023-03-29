import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN, UMB_PROPERTY_SETTINGS_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-property-creator')
export class UmbPropertyCreatorElement extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	#modalContext?: UmbModalContext;

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => (this.#modalContext = instance));
	}

	#onAddProperty() {
		const modalHandler = this.#modalContext?.open(UMB_PROPERTY_SETTINGS_MODAL);

		modalHandler?.onSubmit().then((result) => {
			console.log('result', result);
		});
	}

	render() {
		return html`
			<div>added properties goes here:</div>
			<uui-button look="outline" @click=${this.#onAddProperty}> Add property </uui-button>
		`;
	}
}

export default UmbPropertyCreatorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-creator': UmbPropertyCreatorElement;
	}
}
