import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UUIFileDropzoneElement } from '@umbraco-ui/uui';
import { UmbPropertyEditorElement } from '@umbraco-cms/backoffice/property-editor';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

/**
 * @element umb-property-editor-ui-image-cropper
 */
@customElement('umb-property-editor-ui-image-cropper')
export class UmbPropertyEditorUIImageCropperElement extends UmbLitElement implements UmbPropertyEditorElement {
	static styles = [UUITextStyles];
	@query('#browse-dropzone')
	dropzone?: UUIFileDropzoneElement;

	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	#onBrowse() {
		this.dropzone?.browse();
	}

	render() {
		return html`<div>
			<uui-file-dropzone accept="image/*" id="browse-dropzone" label="Drop files here">
				Drop file here
				<uui-button style="margin-top: 9px;" @click=${this.#onBrowse} look="primary">Browse</uui-button>
			</uui-file-dropzone>
		</div>`;
	}
}

export default UmbPropertyEditorUIImageCropperElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-image-cropper': UmbPropertyEditorUIImageCropperElement;
	}
}
