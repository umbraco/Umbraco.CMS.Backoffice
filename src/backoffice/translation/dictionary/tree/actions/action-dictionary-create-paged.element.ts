import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryStore } from '../../dictionary.store';

@customElement('umb-tree-action-dictionary-create-page')
export class UmbTreeActionDictionaryCreatePageElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css`
		uui-input {
			width:100%;
		}
	`];

	@query('#form')
	private _form!: HTMLFormElement;

	private _dictionaryStore!: UmbDictionaryStore;

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext('umbDictionaryStore', (dictionaryStore: UmbDictionaryStore) => {
			this._dictionaryStore = dictionaryStore;
		});
	}

	private _back() {
		this._actionPageService?.closeTopPage();
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private async _handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(form);
		const key = uuidv4();

		// create the new item before routing to it
		await this._dictionaryStore.create(this._entity.key, key, formData.get('name') as string);

		// use detail from new item to construct edit URL
		const href = `/section/translation/dictionary/edit/${key}`;
		history.pushState(null, '', href);
		this._treeContextMenuService?.close();	
	}

	render() {
		return html` <umb-context-menu-layout headline="Create">
			<p>Create an item under <b>${this._entity.name}</b></p>
			<uui-form>
				<form id="form" name="form" @submit=${this._handleSubmit}>
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
			<uui-button slot="actions" type="button" label="Close" @click=${this._back}></uui-button>
			<uui-button slot="actions" type="button" label="Create" look="primary" @click=${this._submitForm}></uui-button>
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-create-page': UmbTreeActionDictionaryCreatePageElement;
	}
}
