import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { DictionaryResource } from '@umbraco-cms/backend-api';

@customElement('umb-tree-action-dictionary-create-page')
export class UmbTreeActionDictionaryCreatePageElement extends UmbTreeItemActionElement {
	static styles = [
		UUITextStyles,
		css`
			div {
				padding: 0 var(--uui-size-4);
			}
			#title {
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 70px;
				box-sizing: border-box;
				border-bottom: 1px solid var(--uui-color-divider-standalone);
			}
			#title > * {
				margin: 0;
			}
			uui-input {
				width: 100%;
			}
		`,
	];

	private _back() {
		this._actionPageService?.closeTopPage();
	}

	private async _handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(form);

		// create the new item before routing to it
		const { data }= await tryExecuteAndNotify(this, 
			DictionaryResource.postDictionary({
				requestBody: {
				parentId: this._entity.key,
				key: formData.get('name') as string,
			}}));

		if (!data || !data.value?.key) return;

		// use detail from new item to construct edit URL
		const href = `/section/translation/dictionary/edit/${data.value.key}`;
		history.pushState(null, '', href);
		this._treeContextMenuService.close();
	}

	render() {
		return html` <div id="title">
				<h3>Create</h3>
			</div>
			<div>
				<p>Create an item under <b>${this._entity.name}</b></p>
				<uui-form>
					<form id="createForm" name="create" @submit=${this._handleSubmit}>
						<uui-form-layout-item>
							<uui-label for="name" slot="label" required>Name</uui-label>
							<uui-input
								type="text"
								id="name"
								name="name"
								class="w-100"
								required
								required-message="Name is required"></uui-input>
						</uui-form-layout-item>
						<uui-button type="button" label="Close" look="secondary" @click=${this._back}></uui-button>
						<uui-button type="submit" label="Create" look="primary"></uui-button>
					</form>
				</uui-form>
			</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-create-page': UmbTreeActionDictionaryCreatePageElement;
	}
}
