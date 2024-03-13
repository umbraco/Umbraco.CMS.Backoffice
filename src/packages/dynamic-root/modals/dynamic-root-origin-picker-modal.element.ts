import { UmbDocumentPickerContext } from '../../documents/documents/components/input-document/input-document.context.js';
import type { UmbDynamicRootOriginModalData } from './index.js';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { css, html, customElement, state, ifDefined, repeat } from '@umbraco-cms/backoffice/external/lit';
import type { ManifestDynamicRootOrigin } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbTreePickerDynamicRoot } from '@umbraco-cms/backoffice/components';

@customElement('umb-dynamic-root-origin-picker-modal')
export class UmbDynamicRootOriginPickerModalModalElement extends UmbModalBaseElement<UmbDynamicRootOriginModalData> {
	@state()
	private _origins: Array<ManifestDynamicRootOrigin> = [];

	#documentPickerContext = new UmbDocumentPickerContext(this);

	constructor() {
		super();

		this.#documentPickerContext.max = 1;
	}

	connectedCallback() {
		super.connectedCallback();

		if (this.data) {
			this._origins = this.data.items;
		}
	}

	#choose(item: ManifestDynamicRootOrigin) {
		switch (item.meta.originAlias) {
			// NOTE: Edge-case. Currently this is the only one that uses a document picker,
			// but other custom origins may want other configuration options. [LK:2024-01-25]
			case 'ByKey':
				this.#openDocumentPicker(item.meta.originAlias);
				break;
			default:
				this.#submit({ originAlias: item.meta.originAlias });
				break;
		}
	}

	#close() {
		this.modalContext?.reject();
	}

	async #openDocumentPicker(originAlias: string) {
		await this.#documentPickerContext.openPicker({
			hideTreeRoot: true,
		});

		const selectedItems = this.#documentPickerContext.getSelection();
		if (selectedItems.length !== 1) return;

		this.#submit({
			originAlias,
			originKey: selectedItems[0],
		});
	}

	#submit(value: UmbTreePickerDynamicRoot) {
		this.modalContext?.setValue(value);
		this.modalContext?.submit();
	}

	render() {
		return html`
			<umb-body-layout headline="${this.localize.term('dynamicRoot_pickDynamicRootOriginTitle')}">
				<div id="main">
					<uui-box>
						${repeat(
							this._origins,
							(item) => item.alias,
							(item) => html`
								<uui-button @click=${() => this.#choose(item)} look="placeholder" label="${ifDefined(item.meta.label)}">
									<h3>${item.meta.label}</h3>
									<p>${item.meta.description}</p>
								</uui-button>
							`,
						)}
					</uui-box>
				</div>
				<div slot="actions">
					<uui-button @click=${this.#close} look="default" label="${this.localize.term('general_close')}"></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [
		css`
			uui-box > uui-button {
				display: block;
				--uui-button-content-align: flex-start;
			}

			uui-box > uui-button:not(:last-of-type) {
				margin-bottom: var(--uui-size-space-5);
			}

			h3,
			p {
				text-align: left;
			}
		`,
	];
}

export default UmbDynamicRootOriginPickerModalModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dynamic-root-origin-picker-modal': UmbDynamicRootOriginPickerModalModalElement;
	}
}
