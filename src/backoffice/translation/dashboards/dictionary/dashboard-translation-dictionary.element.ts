import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit-html/directives/when.js';
import { tryExecuteAndNotify } from '@umbraco-cms/resources';
import { UmbTableColumn, UmbTableConfig, UmbTableItem } from 'src/backoffice/shared/components/table';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryOverview, DictionaryResource } from '@umbraco-cms/backend-api';

@customElement('umb-dashboard-translation-dictionary')
export class UmbDashboardTranslationDictionaryElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			div {
				padding: 0 var(--uui-size-space-5);
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
	private _tableItems: Array<UmbTableItem> = [];

	@state()
	private _dictionaryItems: DictionaryOverview[] = [];

	constructor() {
		super();
	}

	async connectedCallback() {
		super.connectedCallback();
		await this._setup();
	}

	private async _setup() {
		const dictionaryItems = await tryExecuteAndNotify(this, DictionaryResource.getDictionary({ skip: 0, take: 1000 }));
		this._dictionaryItems = dictionaryItems.data?.items ?? [];

		this._setTableColumns();
		this._setTableItems();
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
			const item: UmbTableItem = {
				key: dictionary.key ?? '',
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
	}

	render() {
		return html` <umb-body-layout headline="Dictionary overview">
			<div>
				${when(
					this._dictionaryItems.length,
					() => html` <umb-table
						.config=${this._tableConfig}
						.columns=${this._tableColumns}
						.items=${this._tableItems}></umb-table>`
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
