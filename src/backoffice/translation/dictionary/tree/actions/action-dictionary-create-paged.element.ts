import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryDetailRepository } from '../../workspace/data/dictionary.detail.repository';

@customElement('umb-tree-action-dictionary-create-page')
export class UmbTreeActionDictionaryCreatePageElement extends UmbTreeItemActionElement {
	static styles = [
		UUITextStyles,
		css`
			uui-input {
				width: 100%;
			}
		`,
	];

	@query('#form')
	private _form!: HTMLFormElement;

	#detailRepo = new UmbDictionaryDetailRepository(this);

	connectedCallback() {
		super.connectedCallback();
	}

	#back() {
		this._actionPageService?.closeTopPage();
	}

	#submitForm() {
		this._form?.requestSubmit();
	}

	#handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(form);

		// create the new item before routing to it
		// this.observe(this.#detailRepo.create(this._entity.key, formData.get('name') as string), (newDictionaryItem) => {	
		// 	// use detail from new item to construct edit URL
		// 	history.pushState(null, '', `/section/translation/dictionary/edit/${newDictionaryItem.key}`);

		// 	this._treeContextMenuService?.close();
		// });
	}

	render() {
		return html` <umb-context-menu-layout headline="Create">
			<p>Create an item under <b>${this._entity.name}</b></p>
			<uui-form>
				<form id="form" name="form" @submit=${this.#handleSubmit}>
					<uui-form-layout-item>
						<uui-label for="nameinput" slot="label" required>Name</uui-label>
						<div>
							<uui-input
								type="text"
								id="nameinput"
								name="name"
								label="name"
								required
								required-message="Name is required"></uui-input>
						</div>
					</uui-form-layout-item>
				</form>
			</uui-form>
			<uui-button slot="actions" type="button" label="Close" @click=${this.#back}></uui-button>
			<uui-button slot="actions" type="button" label="Create" look="primary" @click=${this.#submitForm}></uui-button>
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-create-page': UmbTreeActionDictionaryCreatePageElement;
	}
}
