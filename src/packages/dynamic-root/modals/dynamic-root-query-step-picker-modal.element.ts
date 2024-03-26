import { UmbDocumentTypePickerContext } from '../../documents/document-types/components/input-document-type/input-document-type.context.js';
import type { UmbDynamicRootQueryStepModalData } from './index.js';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state, ifDefined, repeat } from '@umbraco-cms/backoffice/external/lit';
import type { UmbTreePickerDynamicRootQueryStep } from '@umbraco-cms/backoffice/components';
import type { ManifestDynamicRootQueryStep } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-dynamic-root-query-step-picker-modal')
export class UmbDynamicRootQueryStepPickerModalModalElement extends UmbModalBaseElement<UmbDynamicRootQueryStepModalData> {
	@state()
	private _querySteps: Array<ManifestDynamicRootQueryStep> = [];

	#documentTypePickerContext = new UmbDocumentTypePickerContext(this);

	connectedCallback() {
		super.connectedCallback();

		if (this.data) {
			this._querySteps = this.data.items;
		}
	}

	#choose(item: ManifestDynamicRootQueryStep) {
		this.#openDocumentTypePicker(item.meta.queryStepAlias);
	}

	#close() {
		this.modalContext?.reject();
	}

	async #openDocumentTypePicker(alias: string) {
		await this.#documentTypePickerContext.openPicker({
			hideTreeRoot: true,
			pickableFilter: (x) => x.isElement === false,
		});

		const selectedItems = this.#documentTypePickerContext.getSelection();

		this.#submit({
			unique: UmbId.new(),
			alias: alias,
			anyOfDocTypeKeys: selectedItems,
		});
	}

	#submit(value: UmbTreePickerDynamicRootQueryStep) {
		this.modalContext?.setValue(value);
		this.modalContext?.submit();
	}

	render() {
		return html`
			<umb-body-layout headline=${this.localize.term('dynamicRoot_pickDynamicRootQueryStepTitle')}>
				<div id="main">
					<uui-box>
						<uui-ref-list>
							${repeat(
								this._querySteps,
								(item) => item.alias,
								(item) => html`
									<umb-ref-item
										name=${ifDefined(item.meta.label)}
										detail=${ifDefined(item.meta.description)}
										icon=${ifDefined(item.meta.icon)}
										@click=${() => this.#choose(item)}></umb-ref-item>
								`,
							)}
						</uui-ref-list>
					</uui-box>
				</div>
				<div slot="actions">
					<uui-button @click=${this.#close} look="default" label="${this.localize.term('general_close')}"></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [
		UmbTextStyles,
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

export default UmbDynamicRootQueryStepPickerModalModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dynamic-root-query-step-picker-modal': UmbDynamicRootQueryStepPickerModalModalElement;
	}
}
