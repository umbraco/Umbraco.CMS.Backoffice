import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';

import './action-dictionary-create-paged.element';

@customElement('umb-tree-action-dictionary-create')
export default class UmbTreeActionDictionaryCreateElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles, css``];

	private _handleLabelClick() {
		this._actionPageService?.openPage('umb-tree-action-dictionary-create-page');
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this._handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-create': UmbTreeActionDictionaryCreateElement;
	}
}
