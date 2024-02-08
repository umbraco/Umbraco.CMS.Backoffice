import { LitElement, css, html, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import './image-cropper.element.js';
import './image-cropper-focus-setter.element.js';
import './image-cropper-preview.element.js';
import type { UmbImageCropperElement } from './image-cropper.element.js';
import type {
	UmbImageCropperCrop,
	UmbImageCropperCrops,
	UmbImageCropperFocalPoint,
	UmbImageCropperPropertyEditorValue,
} from './index.js';

@customElement('umb-input-image-cropper-field')
export class UmbInputImageCropperFieldElement extends LitElement {
	#value?: UmbImageCropperPropertyEditorValue;

	@property({ type: Object })
	file?: File;

	@state()
	currentCrop?: UmbImageCropperCrop;

	@state()
	crops: UmbImageCropperCrops = [];

	@state()
	focalPoint: UmbImageCropperFocalPoint = { left: 0.5, top: 0.5 };

	@state()
	src = '';

	#onCropClick(crop: any) {
		const index = this.crops.findIndex((c) => c.alias === crop.alias);

		if (index === -1) return;

		this.currentCrop = { ...this.crops[index] };
	}

	#onCropChange(event: CustomEvent) {
		const target = event.target as UmbImageCropperElement;
		const value = target.value;

		if (!value) return;

		const index = this.crops.findIndex((crop) => crop.alias === value.alias);

		if (index === undefined) return;

		this.crops[index] = value;
		this.currentCrop = undefined;
		this.#updateValue();
	}

	#onFocalPointChange(event: CustomEvent) {
		this.focalPoint = event.detail;
		this.#updateValue();
	}

	#updateValue() {
		this.#value = {
			crops: [...this.crops],
			focalPoint: this.focalPoint,
			src: this.src,
		};

		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	#onResetFocalPoint() {
		this.focalPoint = { left: 0.5, top: 0.5 };
		this.#updateValue();
	}

	#onFileChange() {
		console.log('fileasdasdasd', this.file);

		if (!this.file) return;

		const reader = new FileReader();
		reader.onload = (event: any) => {
			const imageDataUrl = event.target.result;
			this.src = imageDataUrl;
		};

		reader.readAsDataURL(this.file);
	}

	updated(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has('file')) {
			this.#onFileChange();
		}
	}

	render() {
		console.log('fileasdasdasd', this.file);
		return html`
			<div id="main">${this.#renderMain()}</div>
			<div id="side">${this.#renderSide()}</div>
		`;
	}

	#renderMain() {
		return this.currentCrop
			? html`<umb-image-cropper
					@change=${this.#onCropChange}
					.src=${this.src}
					.focalPoint=${this.focalPoint}
					.value=${this.currentCrop}></umb-image-cropper>`
			: html`<umb-image-cropper-focus-setter
						@change=${this.#onFocalPointChange}
						.focalPoint=${this.focalPoint}
						.src=${this.src}></umb-image-cropper-focus-setter>
					<div id="actions">
						<uui-button label="Remove files">Remove files (NOT IMPLEMENTED YET)</uui-button>
						<uui-button label="Reset focal point" @click=${this.#onResetFocalPoint}>Reset focal point</uui-button>
					</div> `;
	}

	#renderSide() {
		if (!this.#value || !this.crops) return;

		return repeat(
			this.crops,
			(crop) => crop.alias + JSON.stringify(crop.coordinates),
			(crop) =>
				html` <umb-image-cropper-preview
					@click=${() => this.#onCropClick(crop)}
					.crop=${crop}
					.focalPoint=${this.focalPoint}
					.src=${this.src}></umb-image-cropper-preview>`,
		);
	}
	static styles = css`
		:host {
			display: flex;
			width: 100%;
			box-sizing: border-box;
			gap: var(--uui-size-space-3);
			height: 400px;
		}
		#main {
			max-width: 500px;
			min-width: 300px;
			width: 100%;
			height: 100%;
			display: flex;
			gap: var(--uui-size-space-1);
			flex-direction: column;
		}
		#actions {
			display: flex;
			justify-content: space-between;
		}
		umb-image-cropper-focus-setter {
			height: calc(100% - 33px - var(--uui-size-space-1)); /* Temp solution to make room for actions */
		}
		#side {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			gap: var(--uui-size-space-3);
			flex-grow: 1;
			overflow-y: auto;
			height: fit-content;
			max-height: 100%;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-image-cropper-field': UmbInputImageCropperFieldElement;
	}
}
