import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { DictionaryResource } from '@umbraco-cms/backend-api';

@customElement('umb-tree-action-dictionary-create-page')
export class UmbTreeActionDictionaryCreatePageElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css``];

	@query('#form')
	private _form!: HTMLFormElement;

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

		// create the new item before routing to it
		const { data } = await tryExecuteAndNotify(
			this,
			DictionaryResource.postDictionary({
				requestBody: {
					parentId: this._entity.key,
					key: formData.get('name') as string,
				},
			})
		);

		if (!data || !data.value?.key) return;

		// use detail from new item to construct edit URL
		const href = `/section/translation/dictionary/edit/${data.value.key}`;
		history.pushState(null, '', href);
		this._treeContextMenuService.close();
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
								class="w-100"
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
