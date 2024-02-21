import { UmbTreeContextBase } from './tree.context.js';
import type { UmbTreeItemModelBase } from './types.js';
import { html, nothing, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

import './tree-item-default/tree-item.element.js';
import './tree-item-base/tree-item-base.element.js';

export type UmbTreeSelectionConfiguration = {
	multiple?: boolean;
	selectable?: boolean;
	selection?: Array<string | null>;
};

@customElement('umb-tree')
export class UmbTreeElement extends UmbLitElement {
	@property({ type: String, reflect: true })
	set alias(newVal) {
		this.#treeContext.setTreeAlias(newVal);
	}
	get alias() {
		return this.#treeContext.getTreeAlias();
	}

	private _selectionConfiguration: UmbTreeSelectionConfiguration = {
		multiple: false,
		selectable: true,
		selection: [],
	};

	@property({ type: Object })
	set selectionConfiguration(config: UmbTreeSelectionConfiguration) {
		this._selectionConfiguration = config;
		this.#treeContext.selection.setMultiple(config.multiple ?? false);
		this.#treeContext.selection.setSelectable(config.selectable ?? true);
		this.#treeContext.selection.setSelection(config.selection ?? []);
	}
	get selectionConfiguration(): UmbTreeSelectionConfiguration {
		return this._selectionConfiguration;
	}

	// TODO: what is the best name for this functionality?
	private _hideTreeRoot = false;
	@property({ type: Boolean, attribute: 'hide-tree-root' })
	set hideTreeRoot(newVal: boolean) {
		const oldVal = this._hideTreeRoot;
		this._hideTreeRoot = newVal;
		if (newVal === true) {
			this.#observeRootItems();
		}

		this.requestUpdate('hideTreeRoot', oldVal);
	}
	get hideTreeRoot() {
		return this._hideTreeRoot;
	}

	@property()
	set selectableFilter(newVal) {
		this.#treeContext.selectableFilter = newVal;
	}
	get selectableFilter() {
		return this.#treeContext.selectableFilter;
	}

	@property()
	set filter(newVal) {
		this.#treeContext.filter = newVal;
	}
	get filter() {
		return this.#treeContext.filter;
	}

	@state()
	private _items: UmbTreeItemModelBase[] = [];

	@state()
	private _treeRoot?: UmbTreeItemModelBase;

	#treeContext = new UmbTreeContextBase<UmbTreeItemModelBase>(this);
	#rootItemsObserver?: UmbObserverController<Array<UmbTreeItemModelBase>>;

	constructor() {
		super();
		this.#observeTreeRoot();
	}

	#observeTreeRoot() {
		this.observe(
			this.#treeContext.treeRoot,
			(treeRoot) => {
				this._treeRoot = treeRoot;
			},
			'umbTreeRootObserver',
		);
	}

	async #observeRootItems() {
		if (!this.#treeContext?.requestRootItems) throw new Error('Tree does not support root items');
		this.#rootItemsObserver?.destroy();

		const { asObservable } = await this.#treeContext.requestRootItems();

		if (asObservable) {
			this.#rootItemsObserver = this.observe(asObservable(), (rootItems) => {
				const oldValue = this._items;
				this._items = rootItems;
				this.requestUpdate('_items', oldValue);
			});
		}
	}

	getSelection() {
		return this.#treeContext.selection.getSelection();
	}

	render() {
		return html` ${this.#renderTreeRoot()} ${this.#renderRootItems()}`;
	}

	#renderTreeRoot() {
		if (this.hideTreeRoot || this._treeRoot === undefined) return nothing;
		return html` <umb-tree-item-default .item=${this._treeRoot}></umb-tree-item-default> `;
	}

	#renderRootItems() {
		if (this._items?.length === 0) return nothing;
		return html`
			${repeat(
				this._items,
				// TODO: use unique here:
				(item, index) => item.name + '___' + index,
				(item) => html`<umb-tree-item-default .item=${item}></umb-tree-item-default>`,
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree': UmbTreeElement;
	}
}
