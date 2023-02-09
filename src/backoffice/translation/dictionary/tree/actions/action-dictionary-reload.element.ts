import { UUITextStyles } from '@umbraco-ui/uui-css';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import UmbTreeItemActionElement from '../../../../shared/components/tree/action/tree-item-action.element';


@customElement('umb-tree-action-dictionary-reload')
export default class UmbTreeActionDictionaryReloadElement extends UmbTreeItemActionElement {
	static styles = [UUITextStyles];

	#handleLabelClick() {
		alert('reload me!')
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this.#handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-dictionary-reload': UmbTreeActionDictionaryReloadElement;
	}
}
