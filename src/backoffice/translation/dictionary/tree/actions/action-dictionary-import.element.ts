import { UUITextStyles } from '@umbraco-ui/uui-css';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';

import './action-dictionary-import-paged.element';

@customElement('umb-tree-action-dictionary-import')
export default class UmbTreeActionDictionaryImportElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles];
	
	#handleLabelClick() {
		this._actionPageService?.openPage('umb-tree-action-dictionary-import-page');
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this.#handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-import': UmbTreeActionDictionaryImportElement;
	}
}
