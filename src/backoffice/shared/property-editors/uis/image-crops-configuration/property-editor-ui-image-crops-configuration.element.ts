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
	private crops: Array<ImageCrop> = [];

	#addCrop() {
		this.crops.push({
			alias: '',
			width: 0,
			height: 0,
		});

		this.requestUpdate('crops');
	}

	render() {
		return this.crops.length > 0 ? this.#renderCrops() : this.#renderEmpty();
	}

	#renderCrops() {
		return html`<div>
			<div class="crop">
				<b>Alias</b>
				<b>Width</b>
				<b>Height</b>
			</div>
			${this.crops.map(
				(crop) => html`<div class="crop">
					<uui-input style="border-right: none;" autocomplete="off">${crop.alias}</uui-input>
					<uui-input style="border-right: none;" autocomplete="off">
						${crop.width}
						<div slot="append" class="crop-pixel">px</div>
					</uui-input>
					<uui-input autocomplete="off">
						${crop.height}
						<div slot="append" class="crop-pixel">px</div>
					</uui-input>
				</div>`
			)}
		</div>`;
	}

	#renderEmpty() {
		return html`<div id="empty-state">
			<div>
				<b>There are no crops configured for this image</b>
				<p id="empty-state-description">
					Here you can setup predefined crops that images using this image cropper can use. This is useful if you want
					to have specific crops for different usages of the same image.
				</p>
			</div>
			<div id="empty-state-actions">
				<uui-button @click=${this.#addCrop} look="outline">Add crop</uui-button>
				<a
					target="_blank"
					href="https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/property-editors/built-in-umbraco-property-editors/image-cropper">
					Learn more
				</a>
			</div>
			<p></p>
		</div>`;
	}

	static styles = [
		UUITextStyles,
		css`
			#empty-state-description {
				padding-top: var(--uui-size-space-1);
			}
			#empty-state-actions {
				display: flex;
				gap: var(--uui-size-space-4);
				align-items: baseline;
			}
			#empty-state-actions a {
				color: var(--uui-color-interactive);
				text-decoration: none;
			}
			.crop {
				display: grid;
				grid-template-columns: 1fr 100px 100px;
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
