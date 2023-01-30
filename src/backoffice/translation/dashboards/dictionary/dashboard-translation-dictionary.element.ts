import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import { UmbLitElement } from '@umbraco-cms/element';
import {
	UmbDictionaryDetailStore,
	UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN,
} from '../../dictionary/dictionary.detail.store';
import { UmbTableConfig, UmbTableColumn, UmbTableItem } from '../../../../backoffice/shared/components/table';
import {
	UmbTreeContextMenuService,
	UMB_TREE_CONTEXT_MENU_SERVICE_CONTEXT_TOKEN,
} from '../../../../backoffice/shared/components/tree/context-menu/tree-context-menu.service';
import { DictionaryOverview, Language, LanguageResource } from '@umbraco-cms/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';

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
	private _dictionaryItems: DictionaryOverview[] = [];

	private _contextMenuService?: UmbTreeContextMenuService;

	private _detailStore?: UmbDictionaryDetailStore;

	private _tableItems: Array<UmbTableItem> = [];

	private _languages: Array<Language> = [];

	constructor() {
		super();
	}

	async connectedCallback() {
		super.connectedCallback();

		this.consumeContext(
			UMB_TREE_CONTEXT_MENU_SERVICE_CONTEXT_TOKEN,
			(contextMenuService: UmbTreeContextMenuService) => {
				this._contextMenuService = contextMenuService;
			}
		);

		// TODO => temp until language service exists. Need languages as the dictionary response
		// includes the translated iso codes only, no friendly names and no way to tell if a dictionary
		// is missing a translation
		const languagesItems = await LanguageResource.getLanguage({ skip: 0, take: 1000 });
		this._languages = languagesItems.items;

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (detailStore: UmbDictionaryDetailStore) => {
			this._detailStore = detailStore;
			this._getDictionaryItems();
		});
	}

	private async _getDictionaryItems() {
		if (!this._detailStore) return;

		this.observe(this._detailStore.get(0, 1000), (dictionaryItems: DictionaryOverview[]) => {
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

		this._languages.forEach((l) => {
			if (!l.name) return;

			this._tableColumns.push({
				name: l.name ?? '',
				alias: l.isoCode ?? '',
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

			this._languages.forEach((l) => {
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
