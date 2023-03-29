import { html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement } from 'lit/decorators.js';
import { UmbModalBaseElement } from '@umbraco-cms/internal/modal';

@customElement('umb-create-data-type-modal')
export class UmbCreateDataTypeModalElement extends UmbModalBaseElement {
	static styles = [UUITextStyles];

	private _handleCancel() {
		this.modalHandler?.reject();
	}

	#onClick(event: PointerEvent) {
		event.stopPropagation();
	}

	render() {
		return html`
			<umb-body-layout headline="Create Data Type">
				<uui-box>
					<uui-menu-item @click=${this.#onClick} label="Create Data Type">
						<uui-icon slot="icon" name="icon:folder"></uui-icon>}
					</uui-menu-item>
					<uui-menu-item @click=${this.#onClick} label="Create Folder">
						<uui-icon slot="icon" name="icon:folder"></uui-icon>}
					</uui-menu-item>
				</uui-box>
				<uui-button slot="actions" id="cancel" label="Cancel" @click="${this._handleCancel}">Cancel</uui-button>
			</umb-body-layout>
		`;
	}
}

export default UmbCreateDataTypeModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-create-data-type-modal': UmbCreateDataTypeModalElement;
	}
}
