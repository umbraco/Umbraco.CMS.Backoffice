import type {
	UmbDropzoneMediaTypePickerModalData,
	UmbDropzoneMediaTypePickerModalValue,
} from './dropzone-media-type-picker-modal.token.js';
import { css, customElement, html, query, repeat, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbAllowedMediaTypeModel } from '@umbraco-cms/backoffice/media-type';
import type { UUIButtonElement } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-dropzone-media-type-picker-modal')
export class UmbDropzoneMediaTypePickerModalElement extends UmbModalBaseElement<
	UmbDropzoneMediaTypePickerModalData,
	UmbDropzoneMediaTypePickerModalValue
> {
	@state()
	private _options: Array<UmbAllowedMediaTypeModel> = [];

	@state()
	private _filesShown: boolean = false;

	@query('#auto')
	private _buttonAuto!: UUIButtonElement;

	override connectedCallback() {
		super.connectedCallback();
		this._options = this.data?.options ?? [];
		requestAnimationFrame(() => this._buttonAuto.focus());
	}

	#onMediaTypePick(unique: string | undefined) {
		this.value = { mediaTypeUnique: unique };
		this._submitModal();
	}

	override render() {
		return html` <div class="modal">
			<h3>
				${this.localize.term('media_selectMediaTypeForUpload')}
				${this.data?.files?.length ? `(${this.data.files.length})` : ''}
				<uui-icon
					id="info-icon"
					title=${this.localize.term('media_selectMediaTypeForUploadHelp')}
					name="icon-info"
					style="vertical-align: sub;"
					@click=${() => (this._filesShown = !this._filesShown)}>
				</uui-icon>
				<div div class="info-box ${this._filesShown ? 'shown' : ''}">
					${repeat(
						this.data?.files ?? [],
						(file) => file.name,
						(file) => html`<span>${file.name}</span>`,
					)}
				</div>
			</h3>

			<div id="options">
				<uui-button
					id="auto"
					look="secondary"
					@click=${() => this.#onMediaTypePick(undefined)}
					label="Automatically"
					compact>
					<umb-icon name="icon-wand"> </umb-icon> ${this.localize.term('media_selectMediaTypeAutoPick')}
				</uui-button>
				${repeat(
					this._options,
					(option) => option.unique,
					(option) =>
						html`<uui-button
							look="secondary"
							@click=${() => this.#onMediaTypePick(option.unique)}
							label=${option.name}
							compact>
							<umb-icon .name=${option.icon ?? 'icon-circle-dotted'}></umb-icon>${option.name}
						</uui-button>`,
				)}
			</div>
		</div>`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			.modal {
				display: flex;
				flex-direction: column;
				margin: var(--uui-size-layout-1);
				gap: var(--uui-size-3);
			}
			.info-box {
				display: none;
				position: absolute;
				background: var(--uui-color-background);
				padding: var(--uui-size-4);
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-size-1);
				box-shadow: var(--uui-shadow-1);
				margin: var(--uui-size-layout-1);
				margin-bottom: 0;
				font-size: var(--uui-size-4);
				z-index: 100;
				left: 0;
				right: 0;
				top: 25px;
				bottom: 0;
				overflow-y: auto;
				overflow-x: hidden;
			}
			.info-box.shown {
				display: flex;
				flex-direction: column;
			}
			#info-icon {
				cursor: pointer;
			}
			#options {
				display: flex;
				gap: var(--uui-size-3);
			}
			uui-button {
				width: 150px;
				height: 150px;
			}
			umb-icon {
				font-size: var(--uui-size-10);
				margin-bottom: var(--uui-size-2);
			}
		`,
	];
}

export default UmbDropzoneMediaTypePickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dropzone-media-type-picker-modal': UmbDropzoneMediaTypePickerModalElement;
	}
}
