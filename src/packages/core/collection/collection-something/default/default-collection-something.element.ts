import type {
	UmbCollectionItemModel,
	UmbCollectionRootModel,
	UmbCollectionSelectionConfiguration,
} from '../../types.js';
import type { UmbDefaultCollectionSomethingContext } from './default-collection-something.context.js';
import type { PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { html, customElement, repeat, property, state, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-default-collection-something';
@customElement('umb-default-collection-something')
export class UmbDefaultCollectionSomethingElement extends UmbLitElement {
	#api?: UmbDefaultCollectionSomethingContext;
	@property({ type: Object, attribute: false })
	public get api(): UmbDefaultCollectionSomethingContext | undefined {
		return this.#api;
	}
	public set api(value: UmbDefaultCollectionSomethingContext | undefined) {
		this.#api = value;
		// TODO: handle if API gets removed
		if (this.#api === undefined) return;

		this.observe(this.#api.root, (root) => (this._root = root), 'umbObserveRoot');
		this.observe(this.#api.items, (items) => (this._items = items), 'umbObserveItems');
		this.observe(this.#api.pagination.currentPage, (value) => (this._currentPage = value), 'umbObserveCurrentPage');
		this.observe(this.#api.pagination.totalPages, (value) => (this._totalPages = value), 'umbObserveTotalPages');
	}

	#selectionConfiguration: UmbCollectionSelectionConfiguration = {
		multiple: false,
		selectable: true,
		selection: [],
	};

	@property({ type: Object, attribute: false })
	selectionConfiguration: UmbCollectionSelectionConfiguration = this.#selectionConfiguration;

	@property({ type: Boolean, attribute: false })
	hideItemActions: boolean = false;

	@property({ type: Boolean, attribute: false })
	hideRoot: boolean = false;

	@property({ attribute: false })
	selectableFilter: (item: UmbCollectionItemModel) => boolean = () => true;

	@property({ attribute: false })
	filter: (item: UmbCollectionItemModel) => boolean = () => true;

	@state()
	private _root?: UmbCollectionRootModel;

	@state()
	private _items: Array<UmbCollectionItemModel> = [];

	@state()
	private _currentPage = 1;

	@state()
	private _totalPages = 1;

	protected override async updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
	): Promise<void> {
		super.updated(_changedProperties);
		if (this.#api === undefined) throw new Error('API is not set');

		if (_changedProperties.has('selectionConfiguration')) {
			this.#selectionConfiguration = this.selectionConfiguration;

			this.#api.selection.setMultiple(this.#selectionConfiguration.multiple ?? false);
			this.#api.selection.setSelectable(this.#selectionConfiguration.selectable ?? true);
			this.#api.selection.setSelection(this.#selectionConfiguration.selection ?? []);
		}

		if (_changedProperties.has('hideRoot')) {
			this.#api.setHideRoot(this.hideRoot);
		}

		if (_changedProperties.has('selectableFilter')) {
			this.#api.selectableFilter = this.selectableFilter;
		}

		if (_changedProperties.has('filter')) {
			this.#api.filter = this.filter;
		}
	}

	getSelection() {
		return this.#api?.selection.getSelection();
	}

	override render() {
		return html`${this.#renderRoot()} ${this.#renderItems()}${this.#renderPaging()}`;
	}

	// TODO: do we want to catch and emit a backoffice event here?
	#onShowChildren(event: any) {
		event.stopPropagation();
		this.#api?.load();
	}

	#onLoadMoreClick = (event: any) => {
		event.stopPropagation();
		const next = (this._currentPage = this._currentPage + 1);
		this.#api?.pagination.setCurrentPageNumber(next);
	};

	#renderRoot() {
		const rootIcon = this._root?.icon || 'icon-folder';
		return html`
			<uui-menu-item
				.label=${this.localize.string(this._root?.name || '')}
				.hasChildren=${this._root?.hasChildren || false}
				@show-children=${this.#onShowChildren}>
				<uui-icon slot="icon" name=${rootIcon}></uui-icon>
				${this.#renderItems()}
			</uui-menu-item>
		`;
	}

	#renderItems() {
		return html`
			${repeat(
				this._items,
				(item) => item.unique,
				(item) =>
					html`<umb-collection-something-item
						.entityType=${this._root?.entityType}
						.props=${{ hideActions: this.hideItemActions, item }}></umb-collection-something-item>`,
			)}
		`;
	}

	#renderPaging() {
		if (this._totalPages <= 1 || this._currentPage === this._totalPages) {
			return nothing;
		}

		return html` <uui-button @click=${this.#onLoadMoreClick} label="Load more"></uui-button> `;
	}
}

export default UmbDefaultCollectionSomethingElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDefaultCollectionSomethingElement;
	}
}
