import { UUITextStyles } from '@umbraco-ui/uui-css';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '../../../../../core/modal';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';
import { UmbDictionaryDetailStore, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from '../../dictionary.detail.store';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDictionaryDeleteElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles];

	#modalService?: UmbModalService;
	#dictionaryDetailStore?: UmbDictionaryDetailStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (modalService) => {
			this.#modalService = modalService;
		});

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (dictionaryDetailStore) => {
			this.#dictionaryDetailStore = dictionaryDetailStore;
		});
	}

	#handleLabelClick() {
		const modalHandler = this.#modalService?.confirm({
			headline: `Delete ${this._activeTreeItem?.name ?? 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		modalHandler?.onClose().then(({ confirmed }: { confirmed: boolean }) => {
			if (confirmed && this._treeContextMenuService && this.#dictionaryDetailStore && this._activeTreeItem) {
				this.#dictionaryDetailStore?.delete(this._activeTreeItem.key);
				this._treeContextMenuService.close();
			}
		});
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this.#handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-delete': UmbTreeActionDictionaryDeleteElement;
	}
}
