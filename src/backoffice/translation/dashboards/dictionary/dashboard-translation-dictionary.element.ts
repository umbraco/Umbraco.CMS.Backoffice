import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import { UmbDictionaryStore } from '../../dictionary/dictionary.store';
import { UmbTableColumn, UmbTableConfig, UmbTableItem } from 'src/backoffice/shared/components/table';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryOverview, } from '@umbraco-cms/backend-api';
import { UmbTreeContextMenuService } from 'src/backoffice/shared/components/tree/context-menu/tree-context-menu.service';
import type { DictionaryDetails } from '@umbraco-cms/models';

@customElement('umb-dashboard-translation-dictionary')
export class UmbDashboardTranslationDictionaryElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			#body-layout-padding {
				padding: var(--uui-size-space-5);
				display: flex;
				flex-direction: column;
				height: 100%;
			}

			#dictionary-top-bar {
				margin-bottom: var(--uui-size-space-5);
				display: flex;
				justify-content: space-between;
			}

			umb-table {
				display: inline;
				padding: 0;
			}

			umb-empty-state {
				margin: auto;
				font-size: var(--uui-size-6);
			}
		`,
	];

	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: false,
		hideIcon: true,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'name',
		},
	];

	@state()
	private _tableItemsFiltered: Array<UmbTableItem> = [];

	@state()
	private _dictionaryItems: DictionaryOverview[] = [];

	private _contextMenuService?: UmbTreeContextMenuService;

	private _dictionaryStore?: UmbDictionaryStore;

	private _tableItems: Array<UmbTableItem> = [];

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext('umbTreeContextMenuService', (contextMenuService: UmbTreeContextMenuService) => {
			this._contextMenuService = contextMenuService;
		});

		this.consumeContext('umbDictionaryStore', (dictionaryStore: UmbDictionaryStore) => {
			this._dictionaryStore = dictionaryStore;
			this._observeDictionaryItems();
		});
	}

	private async _observeDictionaryItems() {
		if (!this._dictionaryStore) return;

		this.observe(this._dictionaryStore.get(0, 1000), (dictionaryItems: DictionaryDetails[]) => {
			this._dictionaryItems = dictionaryItems;
			this._setTableColumns();
			this._setTableItems();
		});
	}

	/**
	 * We don't know how many items exist for each dictionary until the data arrives
	 * @returns
	 */
	private _setTableColumns() {
		this._dictionaryItems[0].translations?.forEach((t) => {
			this._tableColumns.push({
				name: t.displayName ?? '',
				alias: t.displayName ?? '',
			});
		});
	}

	private _setTableItems() {
		this._tableItems = this._dictionaryItems.map((dictionary) => {
			// key is name to allow filtering on the displayed value
			const item: UmbTableItem = {
				key: dictionary.name ?? '',
				data: [
					{
						columnAlias: 'name',
						value: html`<a style="font-weight:bold" href="/section/translation/dictionary/edit/${dictionary.key}">
							${dictionary.name}</a
						> `,
					},
				],
			};

			dictionary.translations?.forEach((t) => {
				item.data.push({
					columnAlias: t.displayName ?? '',
					value: t.hasTranslation
						? html`<uui-icon
								name="check"
								style="color:var(--uui-color-positive-standalone);display:inline-block"></uui-icon>`
						: html`<uui-icon
								name="alert"
								style="color:var(--uui-color-warning-standalone);display:inline-block"></uui-icon>`,
				});
			});

			return item;
		});

		this._tableItemsFiltered = this._tableItems;
	}

	private _filter(e: { target: HTMLInputElement }) {
		if (e.target.value) {
			this._tableItemsFiltered = this._tableItems.filter((t) => t.key.includes(e.target.value));
		} else {
			this._tableItemsFiltered = this._tableItems;
		}
	}

	private _create() {
		if (!this._contextMenuService) return;

		alert('Open content menu, to create an entry below the root dictionary item')

		// TODO => open method opens the root menu for the given key
		// need to open to a particular action for the given node
		// this._contextMenuService.open({
		// 	key: '',
		// 	name: 'Create',
		// });
	}

	render() {
		return html` <umb-body-layout headline="Dictionary overview">
			<div id="body-layout-padding">
				<div id="dictionary-top-bar">
					<uui-button type="button" look="outline" @click=${this._create}>Create dictionary item</uui-button>
					<uui-input
						@keyup="${this._filter}"
						placeholder="Type to filter..."
						label="Type to filter dictionary"
						id="searchbar">
						<uui-icon name="search" slot="prepend" id="searchbar_icon"></uui-icon>
					</uui-input>
				</div>
				${when(
					this._tableItemsFiltered.length,
					() => html` <umb-table
						.config=${this._tableConfig}
						.columns=${this._tableColumns}
						.items=${this._tableItemsFiltered}></umb-table>`,
					() => html`<umb-empty-state>There were no dictionary items found.</umb-empty-state>`
				)}
			</div>
		</umb-body-layout>`;
	}
}

export default UmbDashboardTranslationDictionaryElement;
declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-translation-dictionary': UmbDashboardTranslationDictionaryElement;
	}
}
