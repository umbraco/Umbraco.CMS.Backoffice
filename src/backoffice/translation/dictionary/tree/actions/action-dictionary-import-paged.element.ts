import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { customElement, query, state } from 'lit/decorators.js';
import { repeat } from 'lit-html/directives/repeat.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryDetailStore, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from '../../dictionary.detail.store';
import { UmbTreeElement } from '../../../../../backoffice/shared/components/tree/tree.element';
import { DictionaryImport } from '@umbraco-cms/backend-api';

@customElement('umb-tree-action-dictionary-import-page')
export class UmbTreeActionDictionaryImportPageElement extends UmbTreeItemActionElement {
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

	private _dictionaryDetailStore!: UmbDictionaryDetailStore;

	@state()
	private _uploadedDictionary?: DictionaryImport;

	@state()
	private _showUploadView = true;

	@state()
	private _showImportView = false;

	@state()
	private _showErrorView = false;

	@state()
	_selection: Array<string> = [];

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (dictionaryDetailStore: UmbDictionaryDetailStore) => {
			this._dictionaryDetailStore = dictionaryDetailStore;
		});
	}

	private _back() {
		this._actionPageService?.closeTopPage();
	}

	private async _importDictionary() {
		if (!this._uploadedDictionary?.tempFileName) return;
		
		// TODO => where do we get parentId? API expects a number, but we have a guid key
		const result = await this._dictionaryDetailStore.import(this._uploadedDictionary.tempFileName, this._selection[0]);

		const path = result?.content?.split(',');
		if (path?.length) {
			this._dictionaryDetailStore.getByKey(path[path.length - 1]);
		}

		this._treeContextMenuService?.close();
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private async _handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;
		if (!this._form.checkValidity()) return;

		const formData = new FormData(this._form);
		this._uploadedDictionary = await this._dictionaryDetailStore.upload(formData);

		if (!this._uploadedDictionary) {
			this._showErrorView = true;
			this._showImportView = false;
			this._treeContextMenuService?.close();
			return;
		}

		this._showUploadView = false;
		this._showImportView = true;
	}

	private _handleSelectionChange(e: CustomEvent) {
		e.stopPropagation();
		const element = e.target as UmbTreeElement;
		this._selection = element.selection;
	}

	private _renderUploadView() {
		return html`<p>
				To import a dictionary item, find the ".udt" file on your computer by clicking the "Import" button (you'll be
				asked for confirmation on the next screen)
			</p>
			<uui-form>
				<form id="form" name="form" @submit=${this._handleSubmit}>
					<uui-form-layout-item>
						<uui-label for="file" slot="label" required>File</uui-label>
						<div>
							<uui-input-file
								accept=".udt"
								name="file"
								id="file"
								required
								required-message="File is required"></uui-input-file>
						</div>
					</uui-form-layout-item>
				</form>
			</uui-form>
			<uui-button slot="actions" type="button" label="Cancel" @click=${this._back}></uui-button>
			<uui-button slot="actions" type="button" label="Import" look="primary" @click=${this._submitForm}></uui-button>`;
	}

	/// TODO => Tree view needs isolation and single-select option
	private _renderImportView() {
		if (!this._uploadedDictionary?.dictionaryItems) return;

		return html`
			<b>Dictionary items</b>
			<ul>
				${repeat(
					this._uploadedDictionary.dictionaryItems,
					(item) => item.name,
					(item) => html`<li>${item.name}</li>`
				)}
			</ul>
			<hr />
			<b>Choose where to import dictionary items (optional)</b>
			<umb-tree
				alias="Umb.Tree.Dictionary"
				@selected=${this._handleSelectionChange}
				.selection=${this._selection}
				selectable></umb-tree>

			<uui-button slot="actions" type="button" label="Cancel" @click=${this._back}></uui-button>
			<uui-button slot="actions" type="button" label="Import" look="primary" @click=${this._importDictionary}></uui-button>
		`;
	}

	render() {
		return html` <umb-context-menu-layout headline="Import">
			${when(this._showUploadView, () => this._renderUploadView())}
			${when(this._showImportView, () => this._renderImportView())}
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-import-page': UmbTreeActionDictionaryImportPageElement;
	}
}
