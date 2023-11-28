import type { UmbTreeItemContext } from '../tree-item-default/index.js';
import { UMB_TREE_ITEM_CONTEXT_TOKEN } from './tree-item-base.context.js';
import { css, html, nothing, customElement, state, ifDefined, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-tree-item-base')
export class UmbTreeItemBaseElement extends UmbLitElement {
	@state()
	private _iconAlias?: string;

	@state()
	private _item?: TreeItemPresentationModel;

	@state()
	private _childItems?: TreeItemPresentationModel[];

	@state()
	private _href?: string;

	@state()
	private _isLoading = false;

	@state()
	private _isSelectableContext = false;

	@state()
	private _isSelectable = false;

	@state()
	private _isSelected = false;

	@state()
	private _hasChildren = false;

	@state()
	private _iconSlotHasChildren = false;

	#treeItemContext?: UmbTreeItemContext<TreeItemPresentationModel>;

	constructor() {
		super();

		this.consumeContext(UMB_TREE_ITEM_CONTEXT_TOKEN, (instance) => {
			this.#treeItemContext = instance;
			if (!this.#treeItemContext) return;
			// TODO: investigate if we can make an observe decorator
			this.observe(this.#treeItemContext.treeItem, (value) => (this._item = value));
			this.observe(this.#treeItemContext.hasChildren, (value) => (this._hasChildren = value));
			this.observe(this.#treeItemContext.isLoading, (value) => (this._isLoading = value));
			this.observe(this.#treeItemContext.isSelectableContext, (value) => (this._isSelectableContext = value));
			this.observe(this.#treeItemContext.isSelectable, (value) => (this._isSelectable = value));
			this.observe(this.#treeItemContext.isSelected, (value) => (this._isSelected = value));
			this.observe(this.#treeItemContext.path, (value) => (this._href = value));
		});
	}

	private _handleSelectedItem(event: Event) {
		event.stopPropagation();
		this.#treeItemContext?.select();
	}

	private _handleDeselectedItem(event: Event) {
		event.stopPropagation();
		this.#treeItemContext?.deselect();
	}

	// TODO: do we want to catch and emit a backoffice event here?
	private _onShowChildren() {
		if (this._childItems && this._childItems.length > 0) return;
		this.#observeChildren();
	}

	async #observeChildren() {
		if (!this.#treeItemContext?.requestChildren) return;

		const { asObservable } = await this.#treeItemContext.requestChildren();
		if (!asObservable) return;

		this.observe(asObservable(), (childItems) => {
			const oldValue = this._childItems;
			this._childItems = childItems;
			this.requestUpdate('_childItems', oldValue);
		});
	}

	private _openActions() {
		this.#treeItemContext?.toggleContextMenu();
	}

	// Note: Currently we want to prevent opening when the item is in a selectable context, but this might change in the future.
	// If we like to be able to open items in selectable context, then we might want to make it as a menu item action, so you have to click ... and chose an action called 'Edit'
	render() {
		return html`
			<uui-menu-item
				@show-children=${this._onShowChildren}
				@selected=${this._handleSelectedItem}
				@deselected=${this._handleDeselectedItem}
				?disabled=${this._isSelectableContext && !this._isSelectable}
				?selectable=${this._isSelectable}
				?selected=${this._isSelected}
				.loading=${this._isLoading}
				.hasChildren=${this._hasChildren}
				label="${ifDefined(this._item?.name)}"
				href="${ifDefined(this._isSelectableContext ? undefined : this._href)}">
				${this.#renderIcon()} ${this.#renderLabel()} ${this.#renderActions()} ${this.#renderChildItems()}
				<slot></slot>
			</uui-menu-item>
		`;
	}

	#hasNodes = (e: Event) => {
		return (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
	};

	#renderIcon() {
		return html`
			<slot
				name="icon"
				slot="icon"
				@slotchange=${(e: Event) => {
					this._iconSlotHasChildren = this.#hasNodes(e);
				}}></slot>
			${this._iconAlias && !this._iconSlotHasChildren
				? html` <uui-icon slot="icon" name="${this._iconAlias}"></uui-icon> `
				: nothing}
		`;
	}

	#renderLabel() {
		return html`<slot name="label" slot="label"></slot>`;
	}

	#renderActions() {
		return this.#treeItemContext && this._item
			? html`<umb-entity-actions-bundle
					slot="actions"
					.entityType=${this.#treeItemContext.type}
					.unique=${this.#treeItemContext.unique}
					.label=${this._item.name}>
			  </umb-entity-actions-bundle>`
			: '';
	}

	#renderChildItems() {
		return html`
			${this._childItems
				? repeat(
						this._childItems,
						// TODO: get unique here instead of name. we might be able to get it from the context
						(item) => item.name,
						(item) => html`<umb-tree-item-default .item=${item}></umb-tree-item-default>`,
				  )
				: ''}
		`;
	}

	static styles = [UmbTextStyles, css``];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-item-base': UmbTreeItemBaseElement;
	}
}
