import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

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

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this.#configuration = config;
	}

	#onChange(event: InputEvent) {
		this.value = {
			blocks: {},
			markup: (event.target as HTMLInputElement).value,
		};
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-tiny-mce
			@change=${this.#onChange}
			.configuration=${this.#configuration}
			.value=${this.value?.markup ?? ''}></umb-input-tiny-mce>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUITinyMceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-tiny-mce': UmbPropertyEditorUITinyMceElement;
	}
}
