import type { UmbImageCropperCrops, UmbImageCropperFocalPoint } from './index.js';
import { css, html, customElement, query, property, state } from '@umbraco-cms/backoffice/external/lit';
import './image-cropper.element.js';
import './image-cropper-focus-setter.element.js';
import './image-cropper-preview.element.js';
import type { UUIFileDropzoneElement, UUIFileDropzoneEvent } from '@umbraco-cms/backoffice/external/uui';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbId } from '@umbraco-cms/backoffice/id';
import type { TemporaryFileQueueItem } from '../../../../core/temporary-file/temporary-file-manager.class.js';
import { UmbTemporaryFileManager } from '../../../../core/temporary-file/temporary-file-manager.class.js';

import './input-image-cropper-field.element.js';

@customElement('umb-input-image-cropper')
export class UmbInputImageCropperElement extends FormControlMixin(UmbLitElement) {
	protected getFormElement() {
		return undefined;
	}

	@query('#dropzone')
	private _dropzone?: UUIFileDropzoneElement;

	@property({ type: Object })
	config: {
		crops: UmbImageCropperCrops;
		focalPoint: UmbImageCropperFocalPoint;
		src: string;
	} = {
		crops: [],
		focalPoint: { left: 0.5, top: 0.5 },
		src: '',
	};

	#manager: UmbTemporaryFileManager;

	@state()
	file?: File;

	constructor() {
		super();
		this.#manager = new UmbTemporaryFileManager(this);

		this.observe(this.#manager.isReady, (value) => (this.error = !value));
		this.observe(this.#manager.queue, (value) => (this.file = value[0]?.file));
	}

	#onUpload(event: UUIFileDropzoneEvent) {
		const file: File = event.detail.files[0];
		console.log('file', file);
		if (!file) return;

		this.#manager.uploadOne(UmbId.new(), file, 'waiting');
	}

	#onBrowse() {
		if (!this._dropzone) return;
		this._dropzone.browse();
	}

	#renderDropzone() {
		return html`
			<uui-file-dropzone id="dropzone" label="dropzone" @change="${this.#onUpload}" accept="">
				<uui-button label="upload" @click="${this.#onBrowse}">Upload file here</uui-button>
			</uui-file-dropzone>
		`;
	}

	#renderImageCropper() {
		return html`<umb-input-image-cropper-field .file=${this.file}></umb-input-image-cropper-field>`;
	}

	render() {
		if (this.file) return this.#renderImageCropper();

		return this.#renderDropzone();
	}
	static styles = css``;
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-image-cropper': UmbInputImageCropperElement;
	}
}
