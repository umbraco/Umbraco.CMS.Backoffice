import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '../../../../../core/modal';
import { UmbDictionaryTreeStore, UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN } from '../data/dictionary.tree.store';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDictionaryDeleteElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css``];

	private _modalService?: UmbModalService;
	private _dictionaryTreeStore?: UmbDictionaryTreeStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (modalService: UmbModalService) => {
			this._modalService = modalService;
		});

		this.consumeContext(UMB_DICTIONARY_TREE_STORE_CONTEXT_TOKEN, (dictionaryTreeStore: UmbDictionaryTreeStore) => {
			this._dictionaryTreeStore = dictionaryTreeStore;
		});
	}

	private _handleLabelClick() {
		const modalHandler = this._modalService?.confirm({
			headline: `Delete ${this._activeTreeItem?.name ?? 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		modalHandler?.onClose().then(({ confirmed }: { confirmed: boolean }) => {
			if (confirmed && this._treeContextMenuService && this._dictionaryTreeStore && this._activeTreeItem) {
				this._dictionaryTreeStore?.delete(this._activeTreeItem.key);
				this._treeContextMenuService.close();
			}
		});
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this._handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-delete': UmbTreeActionDictionaryDeleteElement;
	}
}
