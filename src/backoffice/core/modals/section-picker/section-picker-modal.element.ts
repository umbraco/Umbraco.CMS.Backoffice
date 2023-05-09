import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbSelectionManagerBase } from '@umbraco-cms/backoffice/utils';
import { UmbModalBaseElement } from '@umbraco-cms/internal/modal';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import type { ManifestSection } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbSectionPickerModalData, UmbSectionPickerModalResult } from '@umbraco-cms/backoffice/modal';

@customElement('umb-section-picker-modal')
export class UmbSectionPickerModalElement extends UmbModalBaseElement<
	UmbSectionPickerModalData,
	UmbSectionPickerModalResult
> {
	@state()
	private _sections: Array<ManifestSection> = [];

	#selectionManager = new UmbSelectionManagerBase();

	#submit() {
		this.modalHandler?.submit({
			selection: this.#selectionManager.getSelection(),
		});
	}

	#close() {
		this.modalHandler?.reject();
	}

	connectedCallback(): void {
		super.connectedCallback();

		// TODO: in theory this config could change during the lifetime of the modal, so we could observe it
		this.#selectionManager.setMultiple(this.data?.multiple ?? false);
		this.#selectionManager.setSelection(this.data?.selection ?? []);

		this.observe(
			umbExtensionsRegistry.extensionsOfType('section'),
			(sections: Array<ManifestSection>) => (this._sections = sections)
		);
	}

	render() {
		return html`
			<umb-workspace-editor headline="Select sections">
				<uui-box>
					${this._sections.map(
						(item) => html`
							<uui-menu-item
								label=${item.meta.label}
								selectable
								?selected=${this.#selectionManager.isSelected(item.alias)}
								@selected=${() => this.#selectionManager.select(item.alias)}
								@unselected=${() => this.#selectionManager.deselect(item.alias)}></uui-menu-item>
						`
					)}
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this.#close}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this.#submit}></uui-button>
				</div>
			</umb-workspace-editor>
		`;
	}

	static styles = [UUITextStyles, css``];
}

export default UmbSectionPickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-section-picker-modal': UmbSectionPickerModalElement;
	}
}
