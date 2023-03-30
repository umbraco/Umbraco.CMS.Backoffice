import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UmbPropertyEditorElement } from '@umbraco-cms/backoffice/property-editor';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

export type ImageCrop = {
	alias: string;
	width: number;
	height: number;
};

/**
 * @element umb-property-editor-ui-image-crops-configuration
 */
@customElement('umb-property-editor-ui-image-crops-configuration')
export class UmbPropertyEditorUIImageCropsConfigurationElement
	extends UmbLitElement
	implements UmbPropertyEditorElement
{
	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	@state()
	private _crops: Array<ImageCrop> = [];

	#addCrop() {
		this._crops.push({
			alias: '',
			width: 0,
			height: 0,
		});

		this.requestUpdate('_crops');
	}

	#removeCrop(index: number) {
		this._crops.splice(index, 1);

		this.requestUpdate('_crops');
	}

	render() {
		return this._crops.length > 0 ? this.#renderCrops() : this.#renderEmpty();
	}

	#renderCrops() {
		return html`<div id="crops">
			<div class="crop">
				<b style="grid-column: 2;">Alias</b>
				<b>Width</b>
				<b>Height</b>
			</div>
			${this._crops.map(
				(crop) => html`<div class="crop">
					<div class="move-button">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								fill="currentColor"
								d="M18 11V8l4 4-4 4v-3h-5v5h3l-4 4-4-4h3v-5H6v3l-4-4 4-4v3h5V6H8l4-4 4 4h-3v5z" />
						</svg>
					</div>
					<uui-input style="border-right: none;" autocomplete="off">${crop.alias}</uui-input>
					<uui-input style="border-right: none;" autocomplete="off">
						${crop.width}
						<div slot="append" class="crop-pixel">px</div>
					</uui-input>
					<uui-input autocomplete="off">
						${crop.height}
						<div slot="append" class="crop-pixel">px</div>
					</uui-input>
					<uui-button color="danger" compact class="remove-button" @click=${this.#removeCrop} label="remove crop">
						<uui-icon name="umb:trash"></uui-icon>
					</uui-button>
				</div>`
			)}
			<uui-button @click=${this.#addCrop} look="placeholder" label="Add crop"></uui-button>
		</div>`;
	}

	#renderEmpty() {
		return html`<div id="empty-state">
			<div>
				<b>There are no crops configured for this image</b>
				<p id="empty-state-description">
					Here you can setup predefined crops that images using this image cropper can use. This is useful if you want
					to have specific crops for different usages of the same image.
					<a
						target="_blank"
						href="https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/property-editors/built-in-umbraco-property-editors/image-cropper">
						Learn more
					</a>
				</p>
			</div>
			<div id="empty-state-actions">
				<uui-button @click=${this.#addCrop} look="placeholder" label="Add crop"></uui-button>
			</div>
			<p></p>
		</div>`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				max-width: 500px;
			}
			#crops {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
			}
			#empty-state-description {
				margin-top: var(--uui-size-space-1);
			}
			#empty-state-actions {
				display: flex;
				gap: var(--uui-size-space-4);
				align-items: baseline;
			}
			#empty-state-description a {
				color: var(--uui-color-interactive);
				text-decoration: none;
			}
			#empty-state-description a:hover {
				color: var(--uui-color-interactive-emphasis);
			}
			.crop {
				display: grid;
				grid-template-columns: var(--uui-size-11) 1fr var(--uui-size-32) var(--uui-size-32) var(--uui-size-11);
			}
			.move-button {
				aspect-ratio: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				opacity: 0.5;
			}
			.remove-button {
				aspect-ratio: 1;
				opacity: 0;
			}
			.crop:focus-within .remove-button,
			.crop:hover .remove-button {
				opacity: 1;
			}
			.crop-pixel {
				background-color: var(--uui-color-disabled);
				color: var(--uui-color-disabled-contrast);
				aspect-ratio: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.8rem;
				border-left: 1px solid var(--uui-color-divider-standalone);
			}
		`,
	];
}

export default UmbPropertyEditorUIImageCropsConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-image-crops-configuration': UmbPropertyEditorUIImageCropsConfigurationElement;
	}
}
