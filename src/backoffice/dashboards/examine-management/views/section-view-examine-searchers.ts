import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';

import { UmbModalService, UmbNotificationService, UmbNotificationDefaultData } from '@umbraco-cms/services';

import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';

import { ApiError, ProblemDetails, SearchResult, SearcherResource, Field } from '@umbraco-cms/backend-api';

import './modal-views/fields-viewer.element';
import './modal-views/fields-settings.element';

interface ExposedSearchResultField {
	name?: string | null;
	exposed: boolean;
}

@customElement('umb-dashboard-examine-searcher')
export class UmbDashboardExamineSearcherElement extends UmbContextConsumerMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
			}
			uui-box {
				margin-top: var(--uui-size-space-5);
			}

			uui-box p {
				margin-top: 0;
			}

			div.flex {
				display: flex;
			}
			div.flex > uui-button {
				padding-left: var(--uui-size-space-4);
				height: 0;
			}

			uui-input {
				width: 100%;
				margin-bottom: var(--uui-size-space-5);
			}

			uui-table-head-cell {
				text-transform: capitalize;
			}

			uui-table-row:last-child uui-table-cell {
				padding-bottom: 0;
			}

			uui-table-cell {
				min-width: 100px;
			}

			button.bright {
				font-style: italic;
				color: var(--uui-color-positive-emphasis);
			}

			.field-adder {
				line-height: 0;
				cursor: pointer;
				vertical-align: top;
				background: transparent;
				border: none;
			}

			.table-container uui-scroll-container {
				padding-bottom: var(--uui-size-space-4);
				max-width: 100%;
				overflow-x: scroll;
				flex: 1;
			}

			.table-container {
				display: flex;
				align-items: flex-start;
			}
			uui-tag {
				margin-block: var(--uui-size-5, 15px);
			}

			.exposed-field uui-button {
				align-items: center;
				font-weight: normal;
				font-size: 10px;
				height: 10px;
				width: 10px;
				margin-top: -5px;
			}

			.exposed-field-container {
				display: flex;
				justify-content: space-between;
			}
		`,
	];

	private _notificationService?: UmbNotificationService;
	private _modalService?: UmbModalService;

	@property()
	searcherName!: string;

	@state()
	private _searchResults?: SearchResult[];

	@state()
	private _exposedFields?: ExposedSearchResultField[];

	@state()
	private _searchLoading = false;

	@query('#search-input')
	private _searchInput!: HTMLInputElement;

	constructor() {
		super();
		this.consumeAllContexts(['umbNotificationService', 'umbModalService'], (instances) => {
			this._notificationService = instances['umbNotificationService'];
			this._modalService = instances['umbModalService'];
		});
	}

	private _onNameClick() {
		const data: UmbNotificationDefaultData = { message: 'TODO: Open workspace for this' }; // TODO
		this._notificationService?.peek('warning', { data });
	}

	private _onKeyPress(e: KeyboardEvent) {
		e.key == 'Enter' ? this._onSearch() : undefined;
	}

	private async _onSearch() {
		if (!this._searchInput.value.length) return;
		this._searchLoading = true;
		try {
			const res = await SearcherResource.getSearcherBySearcherNameQuery({
				searcherName: this.searcherName,
				term: this._searchInput.value,
				take: 100,
				skip: 0,
			});
			this._searchResults = res.items;
			this._updateFieldFilter();
		} catch (e) {
			if (e instanceof ApiError) {
				const error = e as ProblemDetails;
				const data: UmbNotificationDefaultData = { message: error.message ?? 'Could not fetch search results' };
				this._notificationService?.peek('danger', { data });
			}
		}
		this._searchLoading = false;
	}

	private _updateFieldFilter() {
		this._searchResults?.map((doc) => {
			const document = doc.fields?.filter((field) => {
				return field.name?.toUpperCase() !== 'NODENAME';
			});
			if (document) {
				const newFieldNames = document.map((field) => {
					return field.name;
				});

				this._exposedFields = this._exposedFields
					? this._exposedFields.filter((field) => {
							return { name: field.name, exposed: field.exposed };
					  })
					: newFieldNames?.map((name) => {
							return { name, exposed: false };
					  });
			}
		});
	}

	private _onFieldFilterClick() {
		const modalHandler = this._modalService?.open('umb-modal-layout-fields-settings', {
			type: 'sidebar',
			size: 'small',
			data: { ...this._exposedFields },
		});
		modalHandler?.onClose().then(({ fields } = {}) => {
			if (!fields) return;
			this._exposedFields = fields;
		});
	}

	render() {
		return html`
			<uui-box headline="Search">
				<p>Search the ${this.searcherName} and view the results</p>
				<div class="flex">
					<uui-input
						id="search-input"
						placeholder="Type to filter..."
						label="Type to filter"
						@keypress=${this._onKeyPress}>
					</uui-input>
					<uui-button color="positive" look="primary" label="Search" @click="${this._onSearch}"> Search </uui-button>
				</div>
				${this.renderSearchResults()}
			</uui-box>
		`;
	}

	// Find the field named 'nodeName' and return its value if it exists in the fields array
	private getSearchResultNodeName(searchResult: SearchResult): string {
		const nodeNameField = searchResult.fields?.find((field) => field.name?.toUpperCase() === 'NODENAME');
		return nodeNameField?.values?.join(', ') ?? '';
	}

	private renderSearchResults() {
		if (this._searchLoading) return html`<uui-loader></uui-loader>`;
		if (!this._searchResults) return nothing;
		if (!this._searchResults.length) {
			return html`<p>No results found</p>`;
		}
		return html`<div class="table-container">
			<uui-scroll-container>
				<uui-table class="search">
					<uui-table-head>
						<uui-table-head-cell style="width:0">Score</uui-table-head-cell>
						<uui-table-head-cell style="width:0">Id</uui-table-head-cell>
						<uui-table-head-cell>Name</uui-table-head-cell>
						<uui-table-head-cell>Fields</uui-table-head-cell>
						${this.renderHeadCells()}
					</uui-table-head>
					${this._searchResults?.map((rowData) => {
						return html`<uui-table-row>
							<uui-table-cell> ${rowData.score} </uui-table-cell>
							<uui-table-cell> ${rowData.id} </uui-table-cell>
							<uui-table-cell>
								<uui-button look="secondary" label="Open workspace for this document" @click="${this._onNameClick}">
									${this.getSearchResultNodeName(rowData)}
								</uui-button>
							</uui-table-cell>
							<uui-table-cell>
								<uui-button
									class="bright"
									look="secondary"
									label="Open sidebar to see all fields"
									@click="${() =>
										this._modalService?.open('umb-modal-layout-fields-viewer', {
											type: 'sidebar',
											size: 'medium',
											data: { ...rowData, name: this.getSearchResultNodeName(rowData) },
										})}">
									${rowData.fields ? Object.keys(rowData.fields).length : ''} fields
								</uui-button>
							</uui-table-cell>
							${rowData.fields ? this.renderBodyCells(rowData.fields) : ''}
						</uui-table-row>`;
					})}
				</uui-table>
			</uui-scroll-container>
			<button class="field-adder" @click="${this._onFieldFilterClick}">
				<uui-icon-registry-essential>
					<uui-tag look="secondary">
						<uui-icon name="add"></uui-icon>
					</uui-tag>
				</uui-icon-registry-essential>
			</button>
		</div>`;
	}

	renderHeadCells() {
		return html`${this._exposedFields?.map((field) => {
			return field.exposed
				? html`<uui-table-head-cell class="exposed-field">
						<div class="exposed-field-container">
							<span>${field.name}</span>
							<uui-button
								look="secondary"
								label="Close field ${field.name}"
								compact
								@click="${() => {
									this._exposedFields = this._exposedFields?.map((f) => {
										return f.name == field.name ? { name: f.name, exposed: false } : f;
									});
								}}"
								>x</uui-button
							>
						</div>
				  </uui-table-head-cell>`
				: html``;
		})}`;
	}

	renderBodyCells(cellData: Field[]) {
		return html`${this._exposedFields?.map((slot) => {
			return cellData.map((field) => {
				return slot.exposed && field.name == slot.name
					? html`<uui-table-cell clip-text>${field.values}</uui-table-cell>`
					: html``;
			});
		})}`;
	}
}

export default UmbDashboardExamineSearcherElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-examine-searcher': UmbDashboardExamineSearcherElement;
	}
}
