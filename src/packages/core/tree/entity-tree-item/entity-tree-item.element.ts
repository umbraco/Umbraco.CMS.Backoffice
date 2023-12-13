import { UmbEntityTreeItemModel } from '../types.js';
import { UmbEntityTreeItemContext } from './entity-tree-item.context.js';
import { css, html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import {
	UmbBackofficeManifestKind,
	UmbTreeItemElement,
	umbExtensionsRegistry,
} from '@umbraco-cms/backoffice/extension-registry';

// TODO: Move to separate file:
const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.EntityTreeItem',
	matchKind: 'entity',
	matchType: 'treeItem',
	manifest: {
		type: 'treeItem',
		elementName: 'umb-entity-tree-item',
	},
};
umbExtensionsRegistry.register(manifest);

@customElement('umb-entity-tree-item')
export class UmbEntityTreeItemElement extends UmbLitElement implements UmbTreeItemElement {
	private _item?: UmbEntityTreeItemModel;
	@property({ type: Object, attribute: false })
	public get item() {
		return this._item;
	}
	public set item(value: UmbEntityTreeItemModel | undefined) {
		this._item = value;
		this.#context.setTreeItem(value);
	}

	#context = new UmbEntityTreeItemContext(this);

	render() {
		if (!this.item) return nothing;
		return html`<umb-tree-item-base></umb-tree-item-base>`;
	}

	static styles = [UmbTextStyles, css``];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-tree-item': UmbEntityTreeItemElement;
	}
}
