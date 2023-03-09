import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { UmbModalLayoutElement } from '../modal-layout.element';
import { umbracoPath } from '@umbraco-cms/utils';

export interface UmbModalEmbeddedMediaData {
	url?: string;
	width: number;
	height: number;
	constrain: boolean;
	preview?: string;
	success: boolean;
	info?: string;
	a11yInfo?: string;
	supportsDimensions: boolean;
	originalWidth: number;
	originalHeight: number;
}

export interface OEmbedResult {
	oEmbedStatus: OEmbedStatus;
	supportsDimensions: boolean;
	markup?: string;
}

export enum OEmbedStatus {
	NotSupported,
	Error,
	Success,
}

// TODO: make use of UmbPickerLayoutBase
@customElement('umb-modal-layout-embedded-media')
export class UmbModalLayoutEmbeddedMediaElement extends UmbModalLayoutElement<UmbModalEmbeddedMediaData> {
	static styles = [
		UUITextStyles,
		css`
			h3 {
				margin-left: var(--uui-size-space-5);
				margin-right: var(--uui-size-space-5);
			}

			uui-input {
				width: 100%;
			}

			.sr-only {
				clip: rect(0, 0, 0, 0);
				border: 0;
				height: 1px;
				margin: -1px;
				overflow: hidden;
				padding: 0;
				position: absolute;
				width: 1px;
			}
		`,
	];

	#originalWidth = 500;
	#originalHeight = 300;
	#loading = false;
	#preview?: string;

	@property()
	private _embed: UmbModalEmbeddedMediaData = {
		url: '',
		width: 360,
		height: 240,
		constrain: true,
		preview: '',
		success: false,
		info: '',
		a11yInfo: '',
		supportsDimensions: false,
		originalHeight: 240,
		originalWidth: 360,
	};

	connectedCallback() {
		super.connectedCallback();
		if (this.data?.url) {
			Object.assign(this._embed, this.data);
			this.#getPreview();
		}
	}

	async #getPreview() {
		if (!this._embed.url) {
			this.#onPreviewFailed('Please enter a URL');
			this.requestUpdate('_embed');
			return;
		}

		this._embed.info = '';
		this._embed.a11yInfo = '';
		this._embed.success = false;

		this.#loading = true;
		this.requestUpdate('_embed');

		try {
			// TODO => use backend cli when available
			const result = await fetch(
				umbracoPath('/rteembed?') +
					new URLSearchParams({
						url: this._embed.url,
						width: this._embed.width?.toString(),
						height: this._embed.height?.toString(),
					} as any)
			);

			const embedResponse: OEmbedResult = await result.json();
			this._embed.preview = '';

			switch (embedResponse.oEmbedStatus) {
				case 0:
					this.#onPreviewFailed('Not supported');
					break;
				case 1:
					this.#onPreviewFailed('Could not embed media - please ensure the URL is valid');
					break;
				case 2:
					this._embed.success = true;
					this._embed.supportsDimensions = embedResponse.supportsDimensions;
					this._embed.preview = embedResponse.markup;
					this._embed.info = '';
					this._embed.a11yInfo = 'Retrieved URL';
					this.#preview = embedResponse.markup;
					break;
			}
		} catch (e) {
			this.#onPreviewFailed('Could not embed media - please ensure the URL is valid');
		}

		this.#loading = false;
		this.requestUpdate('_embed');
	}

	#onPreviewFailed(message: string) {
		this._embed.info = message;
		this._embed.a11yInfo = this._embed.info;
		this._embed.success = false;
		this._embed.supportsDimensions = false;
		this.#preview = undefined;
	}

	#onUrlChange(e: InputEvent) {
		this._embed.url = (e.target as HTMLInputElement).value;
	}

	#onWidthChange(e: InputEvent) {
		this._embed.width = parseInt((e.target as HTMLInputElement).value, 10);
		this.#changeSize('width');
	}

	#onHeightChange(e: InputEvent) {
		this._embed.height = parseInt((e.target as HTMLInputElement).value, 10);
		this.#changeSize('height');
	}

	#changeSize(axis: 'width' | 'height') {
		const resize = this._embed.originalWidth !== this._embed.width || this._embed.originalHeight !== this._embed.height;

		if (this._embed.constrain) {
			if (axis === 'width') {
				this.#originalHeight = Math.round((this._embed.width / this.#originalWidth) * this._embed.height);
				this._embed.height = this.#originalHeight;
			} else {
				this.#originalWidth = Math.round((this._embed.height / this.#originalHeight) * this._embed.width);
				this._embed.width = this.#originalWidth;
			}
		}

		this._embed.originalWidth = this._embed.width;
		this._embed.originalHeight = this._embed.height;

		if (this._embed.url !== '' && resize) {
			this.#getPreview();
		}
	}

	#onConstrainChange() {
		this._embed.constrain = !this._embed.constrain;
	}

	#submit() {
		this.modalHandler?.close({ embed: this._embed });
	}

	#close() {
		this.modalHandler?.close();
	}

	render() {
		return html`
			<umb-workspace-layout headline="Embed">
				<uui-box>
					<umb-workspace-property-layout label="URL" orientation="vertical">
						<div slot="editor">
							<uui-input .value=${this._embed.url} type="text" @change=${this.#onUrlChange}></uui-input>
							<uui-button
								style="margin-top: var(--uui-size-3)"
								look="secondary"
								color="default"
								@click=${this.#getPreview}
								label="Retrieve"></uui-button>

							${when(this.#loading, () => html`<uui-loader-circle></uui-loader-circle>`)}
							${when(
								this.#preview,
								() => html`<div style="margin-top:var(--uui-size-6)">${unsafeHTML(this.#preview)}</div>`
							)}

							<p aria-hidden="true">${this._embed.info}</p>
							<p class="sr-only" role="alert">${this._embed.a11yInfo}</p>
						</div>
					</umb-workspace-property-layout>

					${when(
						this._embed.supportsDimensions && this._embed.success,
						() => html`
							<umb-workspace-property-layout label="Width" orientation="vertical">
								<uui-input
									slot="editor"
									.value=${this._embed.width}
									type="number"
									@change=${this.#onWidthChange}></uui-input>
							</umb-workspace-property-layout>

							<umb-workspace-property-layout label="Height" orientation="vertical">
								<uui-input
									slot="editor"
									.value=${this._embed.height}
									type="number"
									@change=${this.#onHeightChange}></uui-input>
							</umb-workspace-property-layout>

							<umb-workspace-property-layout label="Constrain" orientation="vertical">
								<uui-toggle
									slot="editor"
									@change=${this.#onConstrainChange}
									.checked=${this._embed.constrain}></uui-toggle>
							</umb-workspace-property-layout>
						`
					)}
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this.#close}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this.#submit}></uui-button>
				</div>
			</umb-workspace-layout>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-modal-layout-embedded-media': UmbModalLayoutEmbeddedMediaElement;
	}
}
