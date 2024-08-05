import type { UmbCollectionItemModel } from '../../../types.js';
import type { UmbCollectionSomethingItemContext } from '../types.js';
import { html, nothing, state, ifDefined, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

// eslint-disable-next-line local-rules/enforce-element-suffix-on-element-class-name
export abstract class UmbCollectionSomethingItemElementBase<
	CollectionItemType extends UmbCollectionItemModel,
> extends UmbLitElement {
	#api?: UmbCollectionSomethingItemContext<CollectionItemType>;
	@property({ type: Object, attribute: false })
	public get api(): UmbCollectionSomethingItemContext<CollectionItemType> | undefined {
		return this.#api;
	}
	public set api(value: UmbCollectionSomethingItemContext<CollectionItemType> | undefined) {
		this.#api = value;
		// TODO: handle if API gets removed
		if (this.#api === undefined) return;
		this.#initObservers();
	}

	#item?: CollectionItemType;
	@property({ type: Object, attribute: false })
	get item(): CollectionItemType | undefined {
		return this.#item;
	}
	set item(newVal: CollectionItemType) {
		this.#item = newVal;
		this.#initItem();
	}

	@property({ type: Boolean, attribute: false })
	hideActions: boolean = false;

	@state()
	private _isActive = false;

	@state()
	private _href?: string;

	@state()
	private _isSelectableContext = false;

	@state()
	private _isSelectable = false;

	@state()
	private _isSelected = false;

	@state()
	private _iconSlotHasChildren = false;

	async #initItem() {
		if (!this.#api) return;
		if (!this.#item) return;
		this.#api.setItem(this.#item);
	}

	#initObservers() {
		if (!this.#api) throw new Error('API is not set');
		this.observe(this.#api.item, (value) => (this.#item = value));
		this.observe(this.#api.isActive, (value) => (this._isActive = value));
		this.observe(this.#api.isSelectableContext, (value) => (this._isSelectableContext = value));
		this.observe(this.#api.isSelectable, (value) => (this._isSelectable = value));
		this.observe(this.#api.isSelected, (value) => (this._isSelected = value));
		this.observe(this.#api.path, (value) => (this._href = value));
	}

	#onItemSelected(event: Event) {
		event.stopPropagation();
		this.#api?.select();
	}

	#onItemDeselected(event: Event) {
		event.stopPropagation();
		this.#api?.deselect();
	}

	// Note: Currently we want to prevent opening when the item is in a selectable context, but this might change in the future.
	// If we like to be able to open items in selectable context, then we might want to make it as a menu item action, so you have to click ... and chose an action called 'Edit'
	override render() {
		const label = this.localize.string(this.#item?.name ?? '');
		return html`
			<uui-menu-item
				@selected=${this.#onItemSelected}
				@deselected=${this.#onItemDeselected}
				?active=${this._isActive}
				?disabled=${this._isSelectableContext && !this._isSelectable}
				?selectable=${this._isSelectable}
				?selected=${this._isSelected}
				.caretLabel=${this.localize.term('visuallyHiddenTexts_expandChildItems') + ' ' + label}
				label=${label}
				href="${ifDefined(this._isSelectableContext ? undefined : this._href)}">
				${this.renderIconContainer()} ${this.renderLabel()} ${this.#renderActions()}}
				<slot></slot>
			</uui-menu-item>
		`;
	}

	#hasNodes = (e: Event) => {
		return (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
	};

	renderIconContainer() {
		return html`
			<slot
				name="icon"
				slot="icon"
				@slotchange=${(e: Event) => {
					this._iconSlotHasChildren = this.#hasNodes(e);
				}}></slot>
			${!this._iconSlotHasChildren ? this.#renderIcon() : nothing}
		`;
	}

	renderLabel() {
		return html`<slot name="label" slot="label"></slot>`;
	}

	#renderIcon() {
		const icon = this.#item?.icon;

		if (icon) {
			return html`<umb-icon slot="icon" name="${icon}"></umb-icon>`;
		}

		return html`<umb-icon slot="icon" name="icon-circle-dotted"></umb-icon>`;
	}

	#renderActions() {
		if (this.hideActions) return;
		return this.#api && this.#item
			? html`<umb-entity-actions-bundle
					slot="actions"
					.entityType=${this.#api.entityType}
					.unique=${this.#api.unique}
					.label=${this.#item.name}>
				</umb-entity-actions-bundle>`
			: '';
	}
}
