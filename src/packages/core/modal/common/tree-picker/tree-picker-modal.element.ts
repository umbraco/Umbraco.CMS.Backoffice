import type { UmbTreeElement } from '../../../tree/tree.element.js';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { UmbTreePickerModalData, UmbPickerModalResult } from '@umbraco-cms/backoffice/modal';
import { UmbModalBaseElement } from '@umbraco-cms/internal/modal';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-tree-picker-modal')
export class UmbTreePickerModalElement<TreeItemType extends TreeItemPresentationModel> extends UmbModalBaseElement<
	UmbTreePickerModalData<TreeItemType>,
	UmbPickerModalResult
> {
	@state()
	_selection: Array<string | null> = [];

	@state()
	_multiple = false;

	connectedCallback() {
		super.connectedCallback();

		this._selection = this.data?.selection ?? [];
		this._multiple = this.data?.multiple ?? false;
	}

	#onSelectionChange(e: CustomEvent) {
		e.stopPropagation();
		const element = e.target as UmbTreeElement;
		this._selection = element.selection;
	}

	#submit() {
		this.modalContext?.submit({ selection: this._selection });
	}

	#close() {
		this.modalContext?.reject();
	}

	render() {
		return html`
			<umb-body-layout headline="Select">
				<uui-box>
					<umb-tree
						alias=${this.data?.treeAlias}
						@selected=${this.#onSelectionChange}
						.selection=${this._selection}
						selectable
						.selectableFilter=${this.data?.pickableFilter}
						?multiple=${this._multiple}></umb-tree>
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this.#close}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this.#submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [UUITextStyles, css``];
}

export default UmbTreePickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-picker-modal': UmbTreePickerModalElement<TreeItemPresentationModel>;
	}
}
