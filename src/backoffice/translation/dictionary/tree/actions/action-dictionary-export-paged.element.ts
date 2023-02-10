import { UUITextStyles } from '@umbraco-ui/uui-css';
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryDetailRepository } from '../../workspace/data/dictionary.detail.repository';

@customElement('umb-tree-action-dictionary-export-page')
export class UmbTreeActionDictionaryExportPageElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles,];

	@query('#form')
	private _form!: HTMLFormElement;

	#detailRepo = new UmbDictionaryDetailRepository(this);

	connectedCallback() {
		super.connectedCallback();
	}

	#back() {
		this._actionPageService?.closeTopPage();
	}

	#submitForm() {;
		this._form?.requestSubmit();
	}

	async #handleSubmit(e: SubmitEvent) {
		e.preventDefault();;

		if (!this.#detailRepo) return;

		const form = e.target as HTMLFormElement;
		if (!form) return;

		const formData = new FormData(form);
		/// TODO => decide where to handle file downloads - should be a single entry point
		await this.#detailRepo.export(this._entity.key, (formData.get('includeDescendants') as string) === 'on');
	}

	render() {
		return html` <umb-context-menu-layout headline="Export">
			<uui-form>
				<form id="form" name="form" @submit=${this.#handleSubmit}>
					<uui-form-layout-item>
						<uui-label for="includeDescendants" slot="label">Include descendants</uui-label>
						<uui-toggle id="includeDescendants" name="includeDescendants"></uui-toggle>
					</uui-form-layout-item>
				</form>
			</uui-form>
			<uui-button slot="actions" type="button" label="Cancel" look="secondary" @click=${this.#back}></uui-button>
			<uui-button slot="actions" type="button" label="Export" look="primary" @click=${this.#submitForm}></uui-button>
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-export-page': UmbTreeActionDictionaryExportPageElement;
	}
}
