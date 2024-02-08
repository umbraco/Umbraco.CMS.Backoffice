import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import '../../components/input-image-cropper/input-image-cropper.element.js';
import type { UmbImageCropperFocalPoint } from '@umbraco-cms/backoffice/media';

/**
 * @element umb-property-editor-ui-image-cropper
 */
@customElement('umb-property-editor-ui-image-cropper')
export class UmbPropertyEditorUIImageCropperElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value: any = undefined;

	@state()
	_config: {
		crops: Array<any>;
		focalPoint: { left: number; top: number };
		src: string;
	} = {
		crops: [],
		focalPoint: { left: 0.5, top: 0.5 },
		src: '',
	};

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this._config = {
			crops: config?.getValueByAlias('crops') ?? [],
			focalPoint: config?.getValueByAlias<UmbImageCropperFocalPoint>('focalPoint') ?? { left: 0.5, top: 0.5 },
			src: config?.getValueByAlias('src') ?? '',
		};
	}

	#onChange(e: Event) {
		this.value = (e.target as HTMLInputElement).value;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-image-cropper @change=${this.#onChange} .config=${this._config}></umb-input-image-cropper>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUIImageCropperElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-image-cropper': UmbPropertyEditorUIImageCropperElement;
	}
}
