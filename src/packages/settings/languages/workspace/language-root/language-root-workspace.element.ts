import { UmbLanguageRepository } from '../../repository/language.repository.js';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTableColumn, UmbTableConfig, UmbTableItem } from '@umbraco-cms/backoffice/components';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { LanguageResponseModel } from '@umbraco-cms/backoffice/backend-api';

import './components/language-root-table-delete-column-layout.element.js';
import './components/language-root-table-name-column-layout.element.js';

@customElement('umb-language-root-workspace')
export class UmbLanguageRootWorkspaceElement extends UmbLitElement {
	@state()
	private _tableConfig: UmbTableConfig = {
		allowSelection: false,
	};

	@state()
	private _tableColumns: Array<UmbTableColumn> = [
		{
			name: 'Name',
			alias: 'languageName',
			elementName: 'umb-language-root-table-name-column-layout',
		},
		{
			name: 'ISO Code',
			alias: 'isoCode',
		},
		{
			name: 'Default',
			alias: 'defaultLanguage',
		},
		{
			name: 'Mandatory',
			alias: 'mandatoryLanguage',
		},
		{
			name: 'Fallback',
			alias: 'fallbackLanguage',
		},
		{
			name: '',
			alias: 'delete',
			elementName: 'umb-language-root-table-delete-column-layout',
		},
	];

	@state()
	private _tableItems: Array<UmbTableItem> = [];

	#languageRepository = new UmbLanguageRepository(this);
	private _cultureNames = new Intl.DisplayNames('en', { type: 'language' });

	connectedCallback() {
		super.connectedCallback();
		this.#observeLanguages();
	}

	async #observeLanguages() {
		const { asObservable } = await this.#languageRepository.requestLanguages();

		if (asObservable) {
			this.observe(asObservable(), (languages) => this.#createTableItems(languages));
		}
	}

	#createTableItems(languages: Array<LanguageResponseModel>) {
		this._tableItems = languages.map((language) => {
			return {
				id: language.isoCode ?? '',
				icon: 'umb:globe',
				data: [
					{
						columnAlias: 'languageName',
						value: {
							name: language.name ? language.name : this._cultureNames.of(language.isoCode ?? ''),
							isoCode: language.isoCode,
						},
					},
					{
						columnAlias: 'isoCode',
						value: language.isoCode,
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
						value: languages.find((x) => x.isoCode === language.fallbackIsoCode)?.name,
					},
					{
						columnAlias: 'delete',
						value: language,
					},
				],
			};
		});
	}

	// TODO: Generate the href or retrieve it from something?
	render() {
		return html`
			<umb-body-layout main-no-padding headline="Languages">
				<umb-body-layout header-transparent>
					<uui-button
						slot="header"
						label="Add language"
						look="outline"
						color="default"
						href="section/settings/workspace/language/create"></uui-button>

					<!--- TODO: investigate if it's possible to use a collection component here --->
					<umb-table .config=${this._tableConfig} .columns=${this._tableColumns} .items=${this._tableItems}></umb-table>
				</umb-body-layout>
			</umb-body-layout>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			umb-table {
				/* Why is this needed? */
				height: fit-content;
				display: block;
				padding: 0;
			}
		`,
	];
}

export default UmbLanguageRootWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-root-workspace': UmbLanguageRootWorkspaceElement;
	}
}
