import { customElement, html, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';

import '../../components/input-tiny-mce/input-tiny-mce.element.js';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';

type RichTextEditorValue = {
	blocks: object;
	markup: string;
};

/**
 * @element umb-property-editor-ui-tiny-mce
 */
@customElement('umb-property-editor-ui-tiny-mce')
export class UmbPropertyEditorUITinyMceElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#configuration?: UmbPropertyEditorConfigCollection;

	@property({ type: Object })
	value?: RichTextEditorValue = {
		blocks: {},
		markup: '',
	};

	@state()
	private _alias?: string;

	@state()
	private _variantId?: string;

	constructor() {
		super();
		this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
			this.observe(context.alias, (alias) => (this._alias = alias));
			this.observe(context.variantId, (variantId) => (this._variantId = variantId?.toString() || 'invariant'));
		});
	}

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this.#configuration = config;
	}
	public get config() {
		return this.#configuration;
	}

	#onChange(event: InputEvent & { target: HTMLInputElement }) {
		this.value = {
			blocks: {},
			markup: event.target.value,
		};
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`
			<umb-input-tiny-mce
				.configuration=${this.#configuration}
				.value=${this.value?.markup ?? ''}
				.propertyAlias=${this._alias}
				.variantId=${this._variantId}
				@change=${this.#onChange}>
			</umb-input-tiny-mce>
		`;
	}
}

export default UmbPropertyEditorUITinyMceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-tiny-mce': UmbPropertyEditorUITinyMceElement;
	}
}
