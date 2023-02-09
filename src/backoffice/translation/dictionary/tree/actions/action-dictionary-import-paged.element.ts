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

	@state()
	private _uploadedDictionary?: DictionaryImport;

	@state()
	private _showUploadView = true;

	@state()
	private _showImportView = false;

	@state()
	private _showErrorView = false;

	@state()
	private _selection: Array<string> = [];

	#dictionaryDetailStore!: UmbDictionaryDetailStore;

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (dictionaryDetailStore) => {
			this.#dictionaryDetailStore = dictionaryDetailStore;
		});
	}

	#back() {
		this._actionPageService?.closeTopPage();
	}

	async #importDictionary() {
		if (!this._uploadedDictionary?.tempFileName) return;

		const result = await this.#dictionaryDetailStore.import(this._uploadedDictionary.tempFileName, this._selection[0]);

		const path = result?.content?.split(',');
		if (path?.length) {
			this.#dictionaryDetailStore.getByKey(path[path.length - 1]);
		}

		this._treeContextMenuService?.close();
	}

	#submitForm() {
		this._form?.requestSubmit();
	}

	async #handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!this._treeContextMenuService) return;
		if (!this._form.checkValidity()) return;

		const formData = new FormData(this._form);
		this._uploadedDictionary = await this.#dictionaryDetailStore.upload(formData);

		if (!this._uploadedDictionary) {
			this._showErrorView = true;
			this._showImportView = false;
			this._treeContextMenuService?.close();
			return;
		}

		this._showErrorView = false;
		this._showUploadView = false;
		this._showImportView = true;
	}

	#handleSelectionChange(e: CustomEvent) {
		e.stopPropagation();
		const element = e.target as UmbTreeElement;
		this._selection = element.selection;
	}

	#renderUploadView() {
		return html`<p>
				To import a dictionary item, find the ".udt" file on your computer by clicking the "Import" button (you'll be
				asked for confirmation on the next screen)
			</p>
			<uui-form>
				<form id="form" name="form" @submit=${this.#handleSubmit}>
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
			<uui-button slot="actions" type="button" label="Cancel" @click=${this.#back}></uui-button>
			<uui-button slot="actions" type="button" label="Import" look="primary" @click=${this.#submitForm}></uui-button>`;
	}

	/// TODO => Tree view needs isolation and single-select option
	#renderImportView() {
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
				@selected=${this.#handleSelectionChange}
				.selection=${this._selection}
				selectable></umb-tree>

			<uui-button slot="actions" type="button" label="Cancel" @click=${this.#back}></uui-button>
			<uui-button slot="actions" type="button" label="Import" look="primary" @click=${this.#importDictionary}></uui-button>
		`;
	}

	// TODO => Determine what to display when dictionary import/upload fails
	#renderErrorView() {
		return html`Something went wrong`;
	}

	render() {
		return html` <umb-context-menu-layout headline="Import">
			${when(this._showUploadView, () => this.#renderUploadView())}
			${when(this._showImportView, () => this.#renderImportView())}
			${when(this._showErrorView, () => this.#renderErrorView())}
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-import-page': UmbTreeActionDictionaryImportPageElement;
	}
}
