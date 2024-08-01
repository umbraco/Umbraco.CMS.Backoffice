import type { UmbLanguageDetailModel } from '../../../types.js';
import { UMB_EDIT_LANGUAGE_WORKSPACE_PATH_PATTERN } from '../../../paths.js';
import type { UmbDefaultCollectionContext } from '@umbraco-cms/backoffice/collection';
import { UMB_COLLECTION_CONTEXT } from '@umbraco-cms/backoffice/collection';
import type { UmbTableColumn, UmbTableConfig, UmbTableItem } from '@umbraco-cms/backoffice/components';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbModalRouteBuilder, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/router';
import { UMB_WORKSPACE_MODAL } from '@umbraco-cms/backoffice/modal';

import './column-layouts/boolean/language-table-boolean-column-layout.element.js';
import './column-layouts/name/language-table-name-column-layout.element.js';
import './column-layouts/entity-actions/language-table-entity-actions-column-layout.element.js';

@customElement('umb-language-table-collection-view')
export class UmbLanguageTableCollectionViewElement extends UmbLitElement {
	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: false,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'languageName',
			elementName: 'umb-language-table-name-column-layout',
		},
		{
			name: 'ISO Code',
			alias: 'isoCode',
		},
		{
			name: 'Default',
			alias: 'defaultLanguage',
			elementName: 'umb-language-table-boolean-column-layout',
		},
		{
			name: 'Mandatory',
			alias: 'mandatoryLanguage',
			elementName: 'umb-language-table-boolean-column-layout',
		},
		{
			name: 'Fallback',
			alias: 'fallbackLanguage',
		},
		{
			name: '',
			alias: 'entityActions',
			elementName: 'umb-language-table-entity-actions-column-layout',
		},
	];

	@state()
	private _tableItems: Array<UmbTableItem> = [];
	private _cultureNames = new Intl.DisplayNames('en', { type: 'language' });

	#collectionContext?: UmbDefaultCollectionContext<UmbLanguageDetailModel>;
	#routeBuilder?: UmbModalRouteBuilder;

	constructor() {
		super();

		this.consumeContext(UMB_COLLECTION_CONTEXT, (instance) => {
			this.#collectionContext = instance;
		});

		this.#registerModalRoute();
	}

	#registerModalRoute() {
		new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath(':entityType')
			.onSetup((params) => {
				return { data: { entityType: params.entityType, preset: {} } };
			})
			.observeRouteBuilder((routeBuilder) => {
				this.#routeBuilder = routeBuilder;

				// NOTE: Configuring the observations AFTER the route builder is ready,
				// otherwise there is a race condition and `#collectionContext.items` tends to win. [LK]
				this.#observeCollectionItems();
			});
	}

	#observeCollectionItems() {
		if (!this.#collectionContext) return;
		this.observe(this.#collectionContext.items, (items) => this.#createTableItems(items), 'umbCollectionItemsObserver');
	}

	#createTableItems(languages: Array<UmbLanguageDetailModel>) {
		this._tableItems = languages.map((language) => {
			const editPath = this.#routeBuilder
				? this.#routeBuilder({ entityType: language.entityType }) +
					UMB_EDIT_LANGUAGE_WORKSPACE_PATH_PATTERN.generateLocal({ unique: language.unique })
				: '';

			return {
				id: language.unique,
				icon: 'icon-globe',
				data: [
					{
						columnAlias: 'languageName',
						value: {
							name: language.name ? language.name : this._cultureNames.of(language.unique),
							unique: language.unique,
							editPath,
						},
					},
					{
						columnAlias: 'isoCode',
						value: language.unique,
					},
					{
						columnAlias: 'defaultLanguage',
						value: language.isDefault,
					},
					{
						columnAlias: 'mandatoryLanguage',
						value: language.isMandatory,
					},
					{
						columnAlias: 'fallbackLanguage',
						value: languages.find((x) => x.unique === language.fallbackIsoCode)?.name,
					},
					{
						columnAlias: 'entityActions',
						value: language,
					},
				],
			};
		});
	}

	override render() {
		return html`
			<umb-table .config=${this._tableConfig} .columns=${this._tableColumns} .items=${this._tableItems}></umb-table>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}
		`,
	];
}

export default UmbLanguageTableCollectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-table-collection-view': UmbLanguageTableCollectionViewElement;
	}
}
