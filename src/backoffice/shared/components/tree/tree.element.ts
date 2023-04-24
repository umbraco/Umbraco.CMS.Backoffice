import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'rxjs';
import { repeat } from 'lit/directives/repeat.js';
import { UmbTreeContextBase } from './tree.context';
import type { ManifestTree } from '@umbraco-cms/backoffice/extensions-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';

import './tree-item/tree-item.element';
import './tree-item-base/tree-item-base.element';
import './context-menu/tree-context-menu-page.service';
import './context-menu/tree-context-menu.service';

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

	private _multiple = false;
	@property({ type: Boolean, reflect: true })
	get multiple() {
		return this._multiple;
	}
	set multiple(newVal) {
		const oldVal = this._multiple;
		this._multiple = newVal;
		this.requestUpdate('multiple', oldVal);
		this._treeContext?.setMultiple(newVal);
	}

	@state()
	private _treeManifest?: ManifestTree;

	@state()
	private _items: TreeItemPresentationModel[] = [];

	@state()
	private _treeRoot?: TreeItemPresentationModel;

	private _treeContext?: UmbTreeContextBase;

	private _observeTree() {
		if (!this.alias) return;

		this.observe(
			umbExtensionsRegistry
				.extensionsOfType('tree')
				.pipe(map((treeManifests) => treeManifests.find((treeManifest) => treeManifest.alias === this.alias))),
			async (treeManifest) => {
				if (this._treeManifest?.alias === treeManifest?.alias) return;
				this._treeManifest = treeManifest;
				this.#provideTreeContext();
			}
		);
	}

	#provideTreeContext() {
		if (!this._treeManifest || this._treeContext) return;

		// TODO: if a new tree comes around, which is different, then we should clean up and re provide.
		this._treeContext = new UmbTreeContextBase(this, this._treeManifest);
		this._treeContext.setSelectable(this.selectable);
		this._treeContext.setSelection(this.selection);
		this._treeContext.setMultiple(this.multiple);

		this.#observeSelection();
		this.#observeTreeRoot();

		this.provideContext('umbTreeContext', this._treeContext);
	}

	async #observeTreeRoot() {
		if (!this._treeContext?.requestRootItems) return;

		this._treeContext.requestRootItems();

		this.observe(await this._treeContext.rootItems(), (rootItems) => {
			this._items = rootItems;
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
				(item, index) => index,
				(item) => html`<umb-tree-item .item=${item}></umb-tree-item>`
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree': UmbTreeElement;
	}
}
