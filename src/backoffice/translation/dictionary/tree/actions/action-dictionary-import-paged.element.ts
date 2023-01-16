import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { customElement, query, state } from 'lit/decorators.js';
import { repeat } from 'lit-html/directives/repeat.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryStore } from '../../dictionary.store';
import { DictionaryImport } from '@umbraco-cms/backend-api';
import { UmbTreeElement } from 'src/backoffice/shared/components/tree/tree.element';

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

	private _dictionaryStore!: UmbDictionaryStore;

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

		this.consumeContext('umbDictionaryStore', (dictionaryStore: UmbDictionaryStore) => {
			this._dictionaryStore = dictionaryStore;
		});
	}

	private _back() {
		this._actionPageService?.closeTopPage();
	}

	private async _importDictionary() {
		if (!this._uploadedDictionary?.tempFileName) return;

		// TODO => where do we get parentId? API expects a number, but we have a guid key
		const result = await this._dictionaryStore.import(this._uploadedDictionary?.tempFileName);

		const path = result?.content?.split(',');
		if (path?.length) {
			this._dictionaryStore.getByKey(path[path.length - 1]);
		}

		this._treeContextMenuService?.close();
	}

	private _submitForm() {
		this._form?.requestSubmit();
	}

	private async _uploadDictionary(file: File) {
		this._uploadedDictionary = await this._dictionaryStore.upload(file);

		if (!this._uploadedDictionary) {
			this._showErrorView = true;
			this._showImportView = false;
			this._treeContextMenuService?.close();
			return;
		}

		this._showUploadView = false;
		this._showImportView = true;
	}

	private async _handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(this._form);
		if (!formData || !formData.get('file')) return;

		await this._uploadDictionary(formData.get('file') as File);
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
