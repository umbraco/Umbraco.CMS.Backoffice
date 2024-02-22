import type { UmbUniqueTreeItemModel } from '../types.js';
import { UmbUniqueTreeItemContext } from './unique-tree-item.context.js';
import { html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbBackofficeManifestKind, UmbTreeItemElement } from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

// TODO: Move to separate file:
const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.UniqueTreeItem',
	matchKind: 'unique',
	matchType: 'treeItem',
	manifest: {
		type: 'treeItem',
		elementName: 'umb-unique-tree-item',
	},
};
umbExtensionsRegistry.register(manifest);

@customElement('umb-unique-tree-item')
export class UmbUniqueTreeItemElement extends UmbLitElement implements UmbTreeItemElement {
	private _item?: UmbUniqueTreeItemModel;
	@property({ type: Object, attribute: false })
	public get item() {
		return this._item;
	}
	public set item(value: UmbUniqueTreeItemModel | undefined) {
		this._item = value;
		this.#context.setTreeItem(value);
	}

	#context = new UmbUniqueTreeItemContext(this);

	render() {
		if (!this.item) return nothing;
		return html`<umb-tree-item-base></umb-tree-item-base>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-unique-tree-item': UmbUniqueTreeItemElement;
	}
}
