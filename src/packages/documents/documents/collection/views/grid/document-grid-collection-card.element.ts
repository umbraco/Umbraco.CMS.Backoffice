import { getPropertyValueByAlias } from '../index.js';
import { UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN } from '../../../paths.js';
import type { UmbDocumentCollectionFilterModel, UmbDocumentCollectionItemModel } from '../../types.js';
import { UMB_DOCUMENT_COLLECTION_CONTEXT } from '../../document-collection.context-token.js';
import { UMB_DOCUMENT_ENTITY_TYPE } from '../../../entity.js';
import type { UmbCollectionColumnConfiguration, UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';
import { customElement, html, nothing, property, repeat, state } from '@umbraco-cms/backoffice/external/lit';
import { fromCamelCase } from '@umbraco-cms/backoffice/utils';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UMB_WORKSPACE_MODAL, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import type { UUIInterfaceColor } from '@umbraco-cms/backoffice/external/uui';

const elementName = 'umb-document-grid-collection-card';
@customElement(elementName)
export class UmbDocumentGridCollectionCardElement extends UmbLitElement {
	@property({ type: Object })
	item?: UmbDocumentCollectionItemModel;

	@state()
	private _editDocumentPath = '';

	@state()
	private _selection: Array<string | null> = [];

	@state()
	private _userDefinedProperties?: Array<UmbCollectionColumnConfiguration>;

	#collectionContext?: UmbDefaultCollectionContext<UmbDocumentCollectionItemModel, UmbDocumentCollectionFilterModel>;

	constructor() {
		super();

		this.consumeContext(UMB_DOCUMENT_COLLECTION_CONTEXT, (collectionContext) => {
			this.#collectionContext = collectionContext;
			this.#observeCollectionContext();
		});

		new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath('document')
			.onSetup(() => {
				return { data: { entityType: UMB_DOCUMENT_ENTITY_TYPE, preset: {} } };
			})
			.onReject(() => {
				this.#collectionContext?.requestCollection();
			})
			.onSubmit(() => {
				this.#collectionContext?.requestCollection();
			})
			.observeRouteBuilder((routeBuilder) => {
				this._editDocumentPath = routeBuilder({});
			});
	}

	#observeCollectionContext() {
		if (!this.#collectionContext) return;

		this.observe(
			this.#collectionContext.selection.selection,
			(selection) => (this._selection = selection),
			'_observeSelection',
		);

		this.observe(
			this.#collectionContext.userDefinedProperties,
			(userDefinedProperties) => {
				this._userDefinedProperties = userDefinedProperties;
			},
			'_observeUserDefinedProperties',
		);
	}

	#onOpen(event: Event, unique: string) {
		event.preventDefault();
		event.stopPropagation();

		const url = this._editDocumentPath + UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN.generateLocal({ unique });
		window.history.pushState(null, '', url);
	}

	#onSelect(item: UmbDocumentCollectionItemModel) {
		this.#collectionContext?.selection.select(item.unique);
	}

	#onDeselect(item: UmbDocumentCollectionItemModel) {
		this.#collectionContext?.selection.deselect(item.unique);
	}

	#isSelected(item: UmbDocumentCollectionItemModel) {
		return this.#collectionContext?.selection.isSelected(item.unique);
	}

	render() {
		if (!this.item) return nothing;

		return html` <uui-card-content-node
			.name=${this.item.name ?? 'Unnamed Document'}
			selectable
			?select-only=${this._selection.length > 0}
			?selected=${this.#isSelected(this.item)}
			@open=${(event: Event) => this.#onOpen(event, this.item.unique)}
			@selected=${() => this.#onSelect(this.item)}
			@deselected=${() => this.#onDeselect(this.item)}>
			<umb-icon slot="icon" name=${this.item.icon}></umb-icon>
			${this.#renderState(this.item)} ${this.#renderProperties(this.item)}
		</uui-card-content-node>`;
	}

	#getStateTagConfig(state: string): { color: UUIInterfaceColor; label: string } {
		switch (state) {
			case 'Published':
				return { color: 'positive', label: this.localize.term('content_published') };
			case 'PublishedPendingChanges':
				return { color: 'warning', label: this.localize.term('content_publishedPendingChanges') };
			case 'Draft':
				return { color: 'default', label: this.localize.term('content_unpublished') };
			case 'NotCreated':
				return { color: 'danger', label: this.localize.term('content_notCreated') };
			default:
				return { color: 'danger', label: fromCamelCase(state) };
		}
	}

	#renderState(item: UmbDocumentCollectionItemModel) {
		const tagConfig = this.#getStateTagConfig(item.state);
		return html`<uui-tag slot="tag" color=${tagConfig.color} look="secondary">${tagConfig.label}</uui-tag>`;
	}

	#renderProperties(item: UmbDocumentCollectionItemModel) {
		if (!this._userDefinedProperties) return;
		return html`
			<ul>
				${repeat(
					this._userDefinedProperties,
					(column) => column.alias,
					(column) => html`<li><span>${column.header}:</span> ${getPropertyValueByAlias(item, column.alias)}</li>`,
				)}
			</ul>
		`;
	}

	static styles = [UmbTextStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbDocumentGridCollectionCardElement;
	}
}
