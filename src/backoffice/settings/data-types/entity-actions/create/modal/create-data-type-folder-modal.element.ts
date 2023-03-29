import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, query } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
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

	@query('#dataTypeFolderForm')
	private _formElement?: HTMLFormElement;

	#onCancel() {
		this.modalHandler?.reject();
	}

	#submitForm() {
		this._formElement?.requestSubmit();
	}

	async #onSubmit(event: SubmitEvent) {
		console.log('onSubmit', event);
		event.preventDefault();
		this._formElement?.checkValidity();
		const formData = new FormData(this._formElement);
		console.log(formData);
		const folderName = formData.get('name') as string;
		console.log(folderName);

		const folder = {
			key: uuidv4(),
			name: folderName,
		};

		debugger;

		const { data, error } = await this.#repository.createFolder(folder);
		debugger;
	}

	render() {
		return html`
			<umb-body-layout headline="Create Data Type">
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
