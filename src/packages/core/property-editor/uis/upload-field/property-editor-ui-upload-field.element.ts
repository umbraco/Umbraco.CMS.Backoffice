import type { UmbInputUploadFieldElement } from '../../../components/input-upload-field/input-upload-field.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

/**
 * @element umb-property-editor-ui-upload-field
 */
@customElement('umb-property-editor-ui-upload-field')
export class UmbPropertyEditorUIUploadFieldElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value = '';

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		this._fileExtensions = config
			.getValueByAlias<{ id: number; value: string }[]>('fileExtensions')
			?.map((ext) => ext.value);

		this._multiple = config.getValueByAlias('multiple');
	}

	@state()
	private _fileExtensions?: Array<string>;

	@state()
	private _multiple?: boolean;

	private _onChange(event: CustomEvent) {
		this.value = (event.target as unknown as UmbInputUploadFieldElement).value as string;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-upload-field
			@change="${this._onChange}"
			?multiple="${this._multiple}"
			.fileExtensions="${this._fileExtensions}"
			.keys=${(this.value as string)?.split(',') ?? []}></umb-input-upload-field>`;
	}
}

export default UmbPropertyEditorUIUploadFieldElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-upload-field': UmbPropertyEditorUIUploadFieldElement;
	}
}
