import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { DictionaryResource } from '@umbraco-cms/backend-api';

@customElement('umb-tree-action-dictionary-export-page')
export class UmbTreeActionDictionaryExportPageElement extends UmbTreeItemActionElement {
	static styles = [
		UUITextStyles,
		css``,
	];
	
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

		await tryExecuteAndNotify(
			this,
			DictionaryResource.getDictionaryExportByKey({
				key: this._entity.key,
				includeChildren: (formData.get('includeDescendants') as string) === 'on',
			})
		);
	}

	render() {
		return html` <umb-context-menu-layout headline="Export">
			<uui-form>
				<form id="exportForm" name="export" @submit=${this._handleSubmit}>
					<uui-form-layout-item>
						<uui-label for="includeDescendants" slot="label">Include descendants</uui-label>
						<uui-toggle id="includeDescendants" name="includeDescendants"></uui-toggle>
					</uui-form-layout-item>
				</form>
			</uui-form>
			<uui-button slot="actions" type="button" label="Cancel" look="secondary" @click=${this._back}></uui-button>
			<uui-button slot="actions" type="button" label="Export" look="primary" @click=${this._submitForm}></uui-button>
		</umb-context-menu-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-export-page': UmbTreeActionDictionaryExportPageElement;
	}
}
