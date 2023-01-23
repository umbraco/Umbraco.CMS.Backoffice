import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import { UmbDictionaryStore, UMB_DICTIONARY_STORE_CONTEXT_TOKEN } from '../../dictionary/dictionary.store';
import { UmbTableColumn, UmbTableConfig, UmbTableItem } from 'src/backoffice/shared/components/table';
import { UmbLitElement } from '@umbraco-cms/element';
import { UmbTreeContextMenuService } from 'src/backoffice/shared/components/tree/context-menu/tree-context-menu.service';
import type { DictionaryDetails } from '@umbraco-cms/models';

@customElement('umb-dashboard-translation-dictionary')
export class UmbDashboardTranslationDictionaryElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
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
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [];

	@state()
	private _tableItemsFiltered: Array<UmbTableItem> = [];

	@state()
	private _dictionaryItems: DictionaryDetails[] = [];

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

		this.consumeContext(UMB_DICTIONARY_STORE_CONTEXT_TOKEN, (dictionaryStore: UmbDictionaryStore) => {
			this._dictionaryStore = dictionaryStore;
			this._getDictionaryItems();
		});
	}

	private async _getDictionaryItems() {
		if (!this._dictionaryStore) return;

		this.observe(this._dictionaryStore.get(0, 1000), (dictionaryItems: DictionaryDetails[]) => {
			this._dictionaryItems = dictionaryItems;
			this._setTableColumns();
			this._setTableItems();
		});
	}

	/**
	 * We don't know how many translation items exist for each dictionary until the data arrives
	 * so can not generate the columns in advance. All dictionaries have entries for all languages
	 * so safe to iterate the first item in the set
	 * @returns
	 */
	private _setTableColumns() {
		this._tableColumns = [
			{
				name: 'Name',
				alias: 'name',
			},
		];

		this._dictionaryItems[0]?.translations?.forEach((t) => {
			this._tableColumns.push({
				name: t.displayName ?? '',
				alias: t.displayName ?? '',
			});
		});
	}

	private _setTableItems() {
		this._tableItems = this._dictionaryItems.map((dictionary) => {
			// key is name to allow filtering on the displayed value
			const tableItem: UmbTableItem = {
				key: dictionary.name ?? '',
				icon: 'umb:book-alt',
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
				if (!t.displayName) return;

				tableItem.data.push({
					columnAlias: t.displayName,
					value: t.translation
						? html`<uui-icon
								name="check"
								title="Translation exists for ${t.displayName}"
								style="color:var(--uui-color-positive-standalone);display:inline-block"></uui-icon>`
						: html`<uui-icon
								name="alert"
								title="Translation does not exist for ${t.displayName}"
								style="color:var(--uui-color-warning-standalone);display:inline-block"></uui-icon>`,
				});
			});

			return tableItem;
		});

		this._tableItemsFiltered = this._tableItems;
	}

	private _filter(e: { target: HTMLInputElement }) {
		this._tableItemsFiltered = e.target.value
			? this._tableItems.filter((t) => t.key.includes(e.target.value))
			: this._tableItems;
	}

	private _create() {
		alert('Open content menu, to create an entry below the root dictionary item');

		if (!this._contextMenuService) return;

		// TODO => open method opens the root menu for the given key
		// need to open to a particular action for the given node
		// this._contextMenuService.open({
		// 	key: '',
		// 	name: 'Create',
		// });
	}

	render() {
		return html` <div id="dictionary-top-bar">
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
			)}`;
	}
}

export default UmbDashboardTranslationDictionaryElement;
declare global {
	interface HTMLElementTagNameMap {
		'umb-dashboard-translation-dictionary': UmbDashboardTranslationDictionaryElement;
	}
}
