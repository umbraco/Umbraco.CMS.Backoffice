import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '../../../../../../core/modal';
import UmbTreeItemActionElement from '../../../../../shared/components/tree/action/tree-item-action.element';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDataTypeDeleteElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css``];

	private _modalContext?: UmbModalContext;
	//private _dataTypeStore?: UmbDataTypeStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	private _handleLabelClick() {
		const modalHandler = this._modalContext?.confirm({
			headline: `Delete ${this._activeTreeItem?.name ?? 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		modalHandler?.onClose().then(({ confirmed }: any) => {
			//TODO: Generally no one should talk to stores directly.
			/*
			if (confirmed && this._treeContextMenuService && this._dataTypeStore && this._activeTreeItem) {
				this._dataTypeStore?.delete([this._activeTreeItem.key]);
				this._treeContextMenuService.close();
			}
			*/
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
		'umb-tree-action-data-type-delete': UmbTreeActionDataTypeDeleteElement;
	}
}
