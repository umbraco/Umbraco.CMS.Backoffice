import { DictionaryItem } from '@umbraco-cms/backend-api';
import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryDetailStore, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from '../../dictionary.detail.store';

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

	private _detailStore!: UmbDictionaryDetailStore;

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (detailStore: UmbDictionaryDetailStore) => {
			this._detailStore = detailStore;
		});
	}

	private _back() {
		this._actionPageService?.closeTopPage();
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private _handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(form);

		// create the new item before routing to it
		this.observe(this._detailStore.create(this._entity.key, formData.get('name') as string), (newDictionaryItem: DictionaryItem) => {	
			// use detail from new item to construct edit URL
			history.pushState(null, '', `/section/translation/dictionary/edit/${newDictionaryItem.key}`);

			// TODO => why is this function not accessible?
			// this._treeContextMenuService.close();
		});
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
