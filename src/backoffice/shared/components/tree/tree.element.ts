import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbTreeContextBase } from './tree.context';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

import './tree-item/tree-item.element';
import './tree-item-base/tree-item-base.element';
import './context-menu/tree-context-menu-page.service';
import './context-menu/tree-context-menu.service';

@customElement('umb-tree')
export class UmbTreeElement extends UmbLitElement {
	@property({ type: String, reflect: true })
	get alias() {
		return this.#treeContext.getTreeAlias();
	}
	set alias(newVal) {
		this.#treeContext.setTreeAlias(newVal);
	}

	@property({ type: Boolean, reflect: true })
	get selectable() {
		return this.#treeContext.getSelectable();
	}
	set selectable(newVal) {
		this.#treeContext.setSelectable(newVal);
	}

	@property({ type: Array })
	get selection() {
		return this.#treeContext.getSelection();
	}
	set selection(newVal) {
		this.#treeContext?.setSelection(newVal);
	}

	@property({ type: Boolean, reflect: true })
	get multiple() {
		return this.#treeContext.getMultiple();
	}
	set multiple(newVal) {
		this.#treeContext.setMultiple(newVal);
	}

	// TODO: what is the best name for this functionatliy?
	private _hideTreeRoot = false;
	@property({ type: Boolean, attribute: 'hide-tree-root' })
	get hideTreeRoot() {
		return this._hideTreeRoot;
	}
	set hideTreeRoot(newVal: boolean) {
		const oldVal = this._hideTreeRoot;
		this._hideTreeRoot = newVal;
		if (newVal === true) this.#observeRootItems();
		this.requestUpdate('hideTreeRoot', oldVal);
	}

	@state()
	private _items: TreeItemPresentationModel[] = [];

	@state()
	private _treeRoot?: TreeItemPresentationModel;

	#treeContext = new UmbTreeContextBase<TreeItemPresentationModel>(this);

	#rootItemsObserver?: UmbObserverController<Array<TreeItemPresentationModel>>;

	connectedCallback(): void {
		super.connectedCallback();
		this.#requestTreeRoot();
	}

	async #requestTreeRoot() {
		if (!this.#treeContext?.requestTreeRoot) throw new Error('Tree does not support root');

		const { data } = await this.#treeContext.requestTreeRoot();
		this._treeRoot = data;
	}

	async #observeRootItems() {
		if (!this.#treeContext?.requestRootItems) throw new Error('Tree does not support root items');
		this.#rootItemsObserver?.destroy();

		const { asObservable } = await this.#treeContext.requestRootItems();

		if (asObservable) {
			this.#rootItemsObserver = this.observe(asObservable(), (rootItems) => (this._items = rootItems));
		}
	}

	render() {
		return html` ${this.hideTreeRoot ? this.#renderRootItems() : this.#renderTreeRoot()}`;
	}

	#renderTreeRoot() {
		if (!this._treeRoot) return nothing;
		return html` <umb-tree-item .item=${this._treeRoot}></umb-tree-item> `;
	}

	#renderRootItems() {
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
