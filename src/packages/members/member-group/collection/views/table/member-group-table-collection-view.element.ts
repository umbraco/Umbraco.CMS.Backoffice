import type { UmbMemberGroupCollectionModel } from '../../types.js';
import type { UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';
import { UMB_DEFAULT_COLLECTION_CONTEXT } from '@umbraco-cms/backoffice/collection';
import type { UmbTableColumn, UmbTableConfig, UmbTableItem } from '@umbraco-cms/backoffice/components';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-member-group-table-collection-view')
export class UmbMemberGroupTableCollectionViewElement extends UmbLitElement {
	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: false,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'memberGroupName',
		},
	];

	@state()
	private _tableItems: Array<UmbTableItem> = [];

	#collectionContext?: UmbDefaultCollectionContext<UmbMemberGroupCollectionModel>;

	constructor() {
		super();

		this.consumeContext(UMB_DEFAULT_COLLECTION_CONTEXT, (instance) => {
			this.#collectionContext = instance;
			this.#observeCollectionItems();
		});
	}

	#observeCollectionItems() {
		if (!this.#collectionContext) return;
		this.observe(this.#collectionContext.items, (items) => this.#createTableItems(items), 'umbCollectionItemsObserver');
	}

	#createTableItems(memberGroups: Array<UmbMemberGroupCollectionModel>) {
		this._tableItems = memberGroups.map((memberGroup) => {
			return {
				id: memberGroup.unique,
				icon: 'icon-users',
				data: [
					{
						columnAlias: 'memberGroupName',
						value: html`<a href=${'section/member-management/workspace/member-group/edit/' + memberGroup.unique}
							>${memberGroup.name}</a
						>`,
					},
				],
			};
		});
	}

	render() {
		return html`
			<umb-table .config=${this._tableConfig} .columns=${this._tableColumns} .items=${this._tableItems}></umb-table>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}

			umb-table {
				padding: 0;
			}
		`,
	];
}

export default UmbMemberGroupTableCollectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-member-group-table-collection-view': UmbMemberGroupTableCollectionViewElement;
	}
}
