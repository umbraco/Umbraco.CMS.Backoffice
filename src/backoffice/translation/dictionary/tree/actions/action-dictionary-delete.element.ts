import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalService } from '../../../../../core/modal';
import { UmbDictionaryStore } from '../../dictionary.store';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDictionaryDeleteElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css``];

	private _modalService?: UmbModalService;
	private _dictionaryStore?: UmbDictionaryStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext('umbModalService', (modalService: UmbModalService) => {
			this._modalService = modalService;
		});

		this.consumeContext('umbDictionaryStore', (dictionaryStore: UmbDictionaryStore) => {
			this._dictionaryStore = dictionaryStore;
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
			if (confirmed && this._treeContextMenuService && this._dictionaryStore && this._activeTreeItem) {
				this._dictionaryStore?.delete(this._activeTreeItem.key);
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
