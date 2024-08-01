import { html, nothing, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestMenuItemTreeKind, UmbMenuItemElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLanguageCollectionRepository } from '@umbraco-cms/backoffice/language';
import { UMB_SECTION_CONTEXT } from '@umbraco-cms/backoffice/section';

const elementName = 'umb-collection-menu-item';
@customElement(elementName)
export class UmbCollectionMenuItemElement extends UmbLitElement implements UmbMenuItemElement {
	@property({ type: Object })
	manifest?: ManifestMenuItemTreeKind;

	@state()
	private _items: any[] = [];

	@state()
	private _isLoading = false;

	@state()
	private _hasItems = true;

	@state()
	private _totalPages = 1;

	@state()
	private _currentPage = 1;

	#collectionRepository = new UmbLanguageCollectionRepository(this);
	#sectionContext?: typeof UMB_SECTION_CONTEXT.TYPE;
	#sectionPathname? = '';

	constructor() {
		super();

		this.consumeContext(UMB_SECTION_CONTEXT, (instance) => {
			this.#sectionContext = instance;
			this.#observeSectionPath();
		});
	}

	#observeSectionPath() {
		if (!this.#sectionContext) return;

		this.observe(
			this.#sectionContext.pathname,
			(pathname) => {
				this.#sectionPathname = pathname;
			},
			'observeSectionPath',
		);
	}

	async #onShowChildren(event: any) {
		event.stopPropagation();
		this._isLoading = true;
		const { data } = await this.#collectionRepository.requestCollection({});
		this._items = data?.items ?? [];
		this._isLoading = false;
	}

	#onLoadMoreClick = (event: any) => {
		event.stopPropagation();
		const next = (this._currentPage = this._currentPage + 1);
		console.log(next);
		//this.#treeItemContext?.pagination.setCurrentPageNumber(next);
	};

	#constructPath(entityType: string, unique: string | null) {
		// TODO: Encode uniques [NL]
		return `section/${this.#sectionPathname}/workspace/${entityType}/edit/${unique}`;
	}

	#checkIsActive(entityType: string, unique: string | null) {
		const location = window.location.pathname;
		const itemPath = this.#constructPath(entityType, unique);
		console.log(location, itemPath);
		return location.includes(itemPath);
	}

	override render() {
		const manifest = this.manifest;
		if (!manifest) return nothing;

		const entityType = manifest.meta.entityType;
		if (!entityType) return nothing;

		const label = this.localize.string(manifest.meta.label);

		return html`
			<uui-menu-item
				@show-children=${this.#onShowChildren}
				?active=${this.#checkIsActive(entityType, null)}
				.loading=${this._isLoading}
				.hasChildren=${this._hasItems}
				.caretLabel=${this.localize.term('visuallyHiddenTexts_expandItems') + ' ' + label}
				label=${label}
				href="${this.#constructPath(entityType, null)}">
				${this.#renderIcon(this.manifest?.meta.icon)} ${this.renderLabel()}
				${this.#renderActions(entityType, null, label)} ${this.#renderItems()}
				<slot></slot>
				${this.#renderPaging()}
			</uui-menu-item>
		`;
	}

	renderLabel() {
		return html`<slot name="label" slot="label"></slot>`;
	}

	#renderIcon(icon?: string) {
		return html`${icon ? html`<umb-icon slot="icon" name="${icon}"></umb-icon>` : nothing}`;
	}

	#renderActions(entityType: string, unique: string | null, label: string) {
		return html`<umb-entity-actions-bundle slot="actions" .entityType=${entityType} .unique=${unique} .label=${label}>
		</umb-entity-actions-bundle>`;
	}

	#renderItems() {
		return html`
			${this._items
				? repeat(
						this._items,
						(item, index) => item.name + '___' + index,
						(item) =>
							html`<uui-menu-item
								label=${item.name}
								href=${this.#constructPath(item.entityType, item.unique)}
								?active=${this.#checkIsActive(item.entityType, item.unique)}>
								${this.#renderIcon(this.manifest?.meta.icon)} ${this.renderLabel()}
								${this.#renderActions(item.entityType, item.unique, item.name)}}
							</uui-menu-item>`,
					)
				: ''}
		`;
	}

	#renderPaging() {
		if (this._totalPages <= 1 || this._currentPage === this._totalPages) {
			return nothing;
		}

		return html` <uui-button @click=${this.#onLoadMoreClick} label="Load more"></uui-button> `;
	}
}

export { elementName as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbCollectionMenuItemElement;
	}
}
