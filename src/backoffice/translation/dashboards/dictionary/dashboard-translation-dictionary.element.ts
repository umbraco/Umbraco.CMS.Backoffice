import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import {
	UmbDictionaryDetailStore,
	UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN,
} from '../../dictionary/dictionary.detail.store';
import { UmbTableConfig, UmbTableColumn, UmbTableItem } from '../../../../backoffice/shared/components/table';
import {
	UmbTreeContextMenuService,
	UMB_TREE_CONTEXT_MENU_SERVICE_CONTEXT_TOKEN,
} from '../../../../backoffice/shared/components/tree/context-menu/tree-context-menu.service';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryOverview, Language } from '@umbraco-cms/backend-api';

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
	private _tableItemsFiltered: Array<UmbTableItem> = [];

	#dictionaryItems: DictionaryOverview[] = [];

	#detailStore!: UmbDictionaryDetailStore;

	#contextMenuService?: UmbTreeContextMenuService;

	#tableItems: Array<UmbTableItem> = [];

	#tableColumns: Array<UmbTableColumn> = [];

	#languages: Array<Language> = [];

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, async (detailStore) => {
			this.#detailStore = detailStore;
			this.#languages = await this.#detailStore.getLanguages();

			this.#getDictionaryItems();
		});
	}

	async #getDictionaryItems() {
		if (!this.#detailStore) return;

		this.observe(this.#detailStore.get(0, 1000), (dictionaryItems: DictionaryOverview[]) => {
			this.#dictionaryItems = dictionaryItems;
			this.#setTableColumns();
			this.#setTableItems();
		});
	}

	/**
	 * We don't know how many translation items exist for each dictionary until the data arrives
	 * so can not generate the columns in advance.
	 * @returns
	 */
	#setTableColumns() {
		this.#tableColumns = [
			{
				name: 'Name',
				alias: 'name',
			},
		];

		this.#languages.forEach((l) => {
			if (!l.name) return;

			this.#tableColumns.push({
				name: l.name ?? '',
				alias: l.isoCode ?? '',
			});
		});
	}

	#setTableItems() {
		this.#tableItems = this.#dictionaryItems.map((dictionary) => {
			// key is name to allow filtering on the displayed value
			const tableItem: UmbTableItem = {
				key: dictionary.name ?? '',
				icon: 'umb:book-alt',
				data: [
					{
						columnAlias: 'name',
						value: html`<a
							style="font-weight:bold; padding-left:${(dictionary.level ?? 0) * 10}px"
							href="/section/translation/dictionary/edit/${dictionary.key}">
							${dictionary.name}</a
						> `,
					},
				],
			};

			this.#languages.forEach((l) => {
				if (!l.isoCode) return;

				tableItem.data.push({
					columnAlias: l.isoCode,
					value: dictionary.translatedIsoCodes?.includes(l.isoCode)
						? html`<uui-icon
								name="check"
								title="Translation exists for ${l.name}"
								style="color:var(--uui-color-positive-standalone);display:inline-block"></uui-icon>`
						: html`<uui-icon
								name="alert"
								title="Translation does not exist for ${l.name}"
								style="color:var(--uui-color-danger-standalone);display:inline-block"></uui-icon>`,
				});
			});

			return tableItem;
		});

		this._tableItemsFiltered = this.#tableItems;
	}

	#filter(e: { target: HTMLInputElement }) {
		this._tableItemsFiltered = e.target.value
			? this.#tableItems.filter((t) => t.key.includes(e.target.value))
			: this.#tableItems;
	}

	#create() {
		if (!this.#contextMenuService) return;

		// TODO => from where can we get a contextMenuService instance?
		// TODO => key should be null for root items
		this.#contextMenuService.open({
			key: '',
			name: 'Create',
		});
	}

	render() {
		return html` <div id="dictionary-top-bar">
				<uui-button type="button" look="outline" @click=${this.#create}>Create dictionary item</uui-button>
				<uui-input
					@keyup="${this.#filter}"
					placeholder="Type to filter..."
					label="Type to filter dictionary"
					id="searchbar">
					<div slot="prepend">
						<uui-icon name="search" id="searchbar_icon"></uui-icon>
					</div>
				</uui-input>
			</div>
			${when(
				this._tableItemsFiltered.length,
				() => html` <umb-table
					.config=${this._tableConfig}
					.columns=${this.#tableColumns}
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
