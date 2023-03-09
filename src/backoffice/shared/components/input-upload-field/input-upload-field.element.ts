import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, query, state } from 'lit/decorators.js';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import { ifDefined } from 'lit/directives/if-defined.js';
import { UUIFileDropzoneElement } from '@umbraco-ui/uui';
import { UmbLitElement } from '@umbraco-cms/element';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/notification';

@customElement('umb-input-upload-field')
export class UmbInputUploadFieldElement extends FormControlMixin(UmbLitElement) {
	static styles = [
		UUITextStyles,
		css`
			uui-icon {
				vertical-align: sub;
				margin-right: var(--uui-size-space-4);
			}

			uui-symbol-file-thumbnail {
				box-sizing: border-box;
				min-width: 300px;
				min-height: 150px;
				padding: var(--uui-size-space-4);
				border: 1px solid var(--uui-color-border);
			}
		`,
	];

	private _keys: Array<string> = [];
	/**
	 * @description Keys to the files that belong to this upload field.
	 * @type {Array<String>}
	 * @default empty array
	 */
	@property({ type: Array<string> })
	public set keys(fileKeys: Array<string>) {
		this._keys = fileKeys;
		super.value = this._keys.join(',');
	}
	public get key(): Array<string> {
		return this._keys;
	}

	/**
	 * @description Allowed file extensions. If left empty, all are allowed.
	 * @type {Array<String>}
	 * @default undefined
	 */
	@property({ type: Array<string> })
	fileExtensions?: Array<string>;

	/**
	 * @description Allows the user to upload multiple files.
	 * @type {Boolean}
	 * @default false
	 */
	@property({ type: Boolean })
	multiple?: boolean;

	@state()
	_currentFile?: Blob;

	@state()
	_currentFileTemp?: Blob;

	@state()
	extensions?: Array<string>;

	@query('#dropzone')
	private _dropzone?: UUIFileDropzoneElement;

	private _notificationContext?: UmbNotificationContext;

	protected getFormElement() {
		return undefined;
	}

	constructor() {
		super();
		this.consumeContext(UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
			this._notificationContext = instance;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.#getFile();
		this.#setExtensions();
	}

	#setExtensions() {
		if (!this.fileExtensions?.length) return;

		this.extensions = this.fileExtensions.map((extension) => {
			return `.${extension}`;
		});
	}

	#getFile() {
		if (!this.key.length) return;
		console.log('endpoint to get file, then store it in this._currentFile');
	}

	#validateExtension() {
		if (!this.fileExtensions?.length || !this._currentFileTemp) return true;

		// TODO: Should property editor be able to handle allowed extensions like image/* ?

		const fileExtension = this._currentFileTemp.type.slice(
			this._currentFileTemp.type.lastIndexOf('/') + 1,
			this._currentFileTemp.length
		);

		const allowed = this.fileExtensions.find((x) => x === fileExtension);

		if (!allowed)
			this._notificationContext?.peek('danger', {
				data: { headline: 'File upload', message: 'Chosen file type is not allowed' },
			});

		return allowed ? true : false;
	}

	#onUpload(e: CustomEvent) {
		// UUIFileDropzoneEvent doesnt exist?
		this._currentFileTemp = e.detail.files[0];
		const allowed = this.#validateExtension();

		// Upload via endpoint?
		if (!allowed) return;
		this._currentFile = this._currentFileTemp;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	#handleBrowse() {
		if (!this._dropzone) return;
		this._dropzone.browse();
	}

	#handleRemove() {
		// Remove via endpoint?
		this._currentFile = undefined;
	}

	render() {
		return html`${this.#renderDropzone()} ${this.#renderFile()}`;
	}

	#renderDropzone() {
		if (!this.multiple && this._currentFile) return nothing;
		return html`
			<uui-file-dropzone
				id="dropzone"
				label="dropzone"
				@file-change="${this.#onUpload}"
				accept="${ifDefined(this.extensions?.join(', '))}"
				?multiple="${this.multiple}">
				<uui-button label="upload" @click="${this.#handleBrowse}">Upload file here</uui-button>
			</uui-file-dropzone>
		`;
	}

	#renderFile() {
		if (!this._currentFile) return nothing;
		return html` <div id="wrapper">
				<uui-symbol-file-thumbnail
					style="max-height: 300px"
					src="${ifDefined(this._currentFile.name)}"
					alt="${ifDefined(this._currentFile.name)}">
				</uui-symbol-file-thumbnail>
			</div>
			<uui-button compact @click="${this.#handleRemove}" label="Remove files">
				<uui-icon name="umb:trash"></uui-icon> Remove file(s)
			</uui-button>`;
	}
}

export default UmbInputUploadFieldElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-upload-field': UmbInputUploadFieldElement;
	}
}
