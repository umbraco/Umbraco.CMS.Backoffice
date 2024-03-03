import { UMB_DATA_TYPE_FOLDER_REPOSITORY_ALIAS } from '../../../tree/index.js';
import type { UmbDataTypeCreateOptionsModalData } from './index.js';
import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement, UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_FOLDER_CREATE_MODAL } from '@umbraco-cms/backoffice/tree';

@customElement('umb-data-type-create-options-modal')
export class UmbDataTypeCreateOptionsModalElement extends UmbModalBaseElement<UmbDataTypeCreateOptionsModalData> {
	async #onClick(event: PointerEvent) {
		event.stopPropagation();
		if (!this.data?.parent) throw new Error('A parent is required to create a folder');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const folderModalHandler = modalManager.open(this, UMB_FOLDER_CREATE_MODAL, {
			data: {
				folderRepositoryAlias: UMB_DATA_TYPE_FOLDER_REPOSITORY_ALIAS,
				parent: this.data.parent,
			},
		});

		folderModalHandler?.onSubmit().then(() => this._submitModal());
	}

	#getCreateHref() {
		return `section/settings/workspace/data-type/create/parent/${this.data?.parent.entityType}/${
			this.data?.parent.unique || 'null'
		}`;
	}

	render() {
		return html`
			<umb-body-layout headline="Create Data Type">
				<uui-box>
					<!-- TODO: construct url -->
					<uui-menu-item href=${this.#getCreateHref()} label="New Data Type..." @click=${this._submitModal}>
						<uui-icon slot="icon" name="icon-autofill"></uui-icon>
					</uui-menu-item>
					<uui-menu-item @click=${this.#onClick} label="New Folder...">
						<uui-icon slot="icon" name="icon-folder"></uui-icon>
					</uui-menu-item>
				</uui-box>
				<uui-button slot="actions" id="cancel" label="Cancel" @click="${this._rejectModal}">Cancel</uui-button>
			</umb-body-layout>
		`;
	}
}

export default UmbDataTypeCreateOptionsModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-data-type-create-options-modal': UmbDataTypeCreateOptionsModalElement;
	}
}
