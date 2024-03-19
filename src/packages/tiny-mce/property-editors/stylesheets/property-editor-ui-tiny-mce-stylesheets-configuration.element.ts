import { UmbServerFilePathUniqueSerializer } from '@umbraco-cms/backoffice/server-file-system';
import { customElement, html, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbStylesheetInputElement } from '@umbraco-cms/backoffice/stylesheet';

/**
 * @element umb-property-editor-ui-tiny-mce-stylesheets-configuration
 */
@customElement('umb-property-editor-ui-tiny-mce-stylesheets-configuration')
export class UmbPropertyEditorUITinyMceStylesheetsConfigurationElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	@property({ type: Array })
	public set value(value: Array<string>) {
		if (!value) return;
		this._value = value.map((unique) => this.#serverFilePathUniqueSerializer.toUnique(unique));
	}
	public get value(): Array<string> {
		if (!this._value) return [];
		return this._value.map((unique) => this.#serverFilePathUniqueSerializer.toServerPath(unique)) as string[];
	}
	private _value: Array<string> = [];

	@property({ type: Object, attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	#serverFilePathUniqueSerializer = new UmbServerFilePathUniqueSerializer();

	#onChange(event: CustomEvent) {
		const target = event.target as UmbStylesheetInputElement;
		this._value = target.selection;
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`<umb-stylesheet-input @change=${this.#onChange} .selection=${this._value}></umb-stylesheet-input>`;
	}
}

export default UmbPropertyEditorUITinyMceStylesheetsConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-tiny-mce-stylesheets-configuration': UmbPropertyEditorUITinyMceStylesheetsConfigurationElement;
	}
}
