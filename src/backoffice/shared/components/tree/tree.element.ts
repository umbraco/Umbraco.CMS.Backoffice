import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'rxjs';
import { repeat } from 'lit-html/directives/repeat.js';
import { UmbTreeContextBase } from './tree.context';
import type { Entity, ManifestTree } from '@umbraco-cms/models';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-api';
import { UmbLitElement } from '@umbraco-cms/element';

import './tree-item.element';
import './context-menu/tree-context-menu-page-action-list.element';
import './context-menu/tree-context-menu-page.service';
import './context-menu/tree-context-menu.service';
import './action/tree-item-action-extension.element';

@customElement('umb-tree')
export class UmbTreeElement extends UmbLitElement {
	private _alias = '';
	@property({ type: String, reflect: true })
	get alias() {
		return this._alias;
	}
	set alias(newVal) {
		const oldVal = this._alias;
		this._alias = newVal;
		this.requestUpdate('alias', oldVal);
		this._observeTree();
	}

	private _selectable = false;
	@property({ type: Boolean, reflect: true })
	get selectable() {
		return this._selectable;
	}
	set selectable(newVal) {
		const oldVal = this._selectable;
		this._selectable = newVal;
		this.requestUpdate('selectable', oldVal);
		this._treeContext?.setSelectable(newVal);
	}

	private _selection: Array<string> = [];
	@property({ type: Array })
	get selection() {
		return this._selection;
	}
	set selection(newVal: Array<string>) {
		const oldVal = this._selection;
		this._selection = newVal;
		this.requestUpdate('selection', oldVal);
		this._treeContext?.setSelection(newVal);
	}

	@state()
	private _tree?: ManifestTree;

	@state()
	private _items: Entity[] = [];

	@state()
	private _loading = true;

	private _treeContext?: UmbTreeContextBase;

	protected firstUpdated(): void {
		this._observeTree();
	}

	private _observeTree() {
		if (!this.alias) return;

		this.observe(
			umbExtensionsRegistry
				.extensionsOfType('tree')
				.pipe(map((trees) => trees.find((tree) => tree.alias === this.alias))),
			async (tree) => {
				if (this._tree?.alias === tree?.alias) return;
				this._tree = tree;
				this.#provideTreeContext();
			}
		);
	}

	#provideTreeContext() {
		if (!this._tree || this._treeContext) return;

		// TODO: if a new tree comes around, which is different, then we should clean up and re provide.
		this._treeContext = new UmbTreeContextBase(this, this._tree);
		this._treeContext.setSelectable(this.selectable);
		this._treeContext.setSelection(this.selection);

		this.#observeSelection();
		this.#observeTreeRoot();

		this.provideContext('umbTreeContext', this._treeContext);
	}

	async #observeTreeRoot() {
		if (!this._treeContext?.requestRootItems) return;

		this._treeContext.requestRootItems();

		this.observe(await this._treeContext.rootItems(), (rootItems) => {
			this._items = rootItems as Entity[];
		});
	}

	#observeSelection() {
		if (!this._treeContext) return;

		this.observe(this._treeContext.selection, (selection) => {
			if (this._selection === selection) return;
			this._selection = selection;
			this.dispatchEvent(new CustomEvent('selected'));
		});
	}

	render() {
		return html`
			${repeat(
				this._items,
				(item) => item.key,
				(item) =>
					html`<umb-tree-item
						.key=${item.key}
						.label=${item.name}
						.icon=${item.icon}
						.entityType=${item.type}
						.hasChildren=${item.hasChildren}
						.loading=${this._loading}></umb-tree-item>`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree': UmbTreeElement;
	}
}
