import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, query } from 'lit/decorators.js';
import { UmbDataTypeRepository } from '../../../repository/data-type.repository';
import { UmbModalBaseElement } from '@umbraco-cms/internal/modal';

@customElement('umb-create-data-type-folder-modal')
export class UmbCreateDataTypeFolderModalElement extends UmbModalBaseElement {
	static styles = [
		UUITextStyles,
		css`
			#name {
				width: 100%;
			}
		`,
	];

	#repository = new UmbDataTypeRepository(this);

	connectedCallback() {
		super.connectedCallback();
	}

	@query('#dataTypeFolderForm')
	private _formElement?: HTMLFormElement;

	#onCancel() {
		this.modalHandler?.reject();
	}

	#submitForm() {
		this._formElement?.requestSubmit();
	}

	async #onSubmit(event: SubmitEvent) {
		event.preventDefault();

		const isValid = this._formElement?.checkValidity();
		if (!isValid) return;

		const formData = new FormData(this._formElement);
		const folderName = formData.get('name') as string;

		const folderScaffold = await this.#repository.createFolderScaffold(null);
		folderScaffold.name = folderName;

		const { error } = await this.#repository.createFolder(folderScaffold);

		if (!error) {
			this.modalHandler?.submit();
		}
	}

	render() {
		return html`
			<umb-body-layout headline="Create Folder">
				<uui-box>
					<uui-form>
						<form id="dataTypeFolderForm" name="data" @submit="${this.#onSubmit}">
							<uui-form-layout-item>
								<uui-label id="nameLabel" for="name" slot="label" required>Folder name</uui-label>
								<uui-input
									type="text"
									id="name"
									name="name"
									placeholder="Enter folder name..."
									required
									required-message="Folder name is required"></uui-input>
							</uui-form-layout-item>
						</form>
					</uui-form>
				</uui-box>

				<uui-button slot="actions" id="cancel" label="Cancel" @click="${this.#onCancel}"></uui-button>
				<uui-button
					type="submit"
					slot="actions"
					id="confirm"
					color="positive"
					look="primary"
					label="Create folder"
					@click=${this.#submitForm}></uui-button>
			</umb-body-layout>
		`;
	}
}

export default UmbCreateDataTypeFolderModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-create-data-type-folder-modal': UmbCreateDataTypeFolderModalElement;
	}
}
