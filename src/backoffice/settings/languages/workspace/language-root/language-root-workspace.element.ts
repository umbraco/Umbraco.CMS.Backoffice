import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbTableColumn, UmbTableConfig, UmbTableItem } from '../../../../shared/components/table';
import { UmbLanguageRepository } from '../../repository/language.repository';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { LanguageResponseModel } from '@umbraco-cms/backoffice/backend-api';

import './components/language-root-table-delete-column-layout.element';
import './components/language-root-table-name-column-layout.element';

@customElement('umb-language-root-workspace')
export class UmbLanguageRootWorkspaceElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#main {
				margin: var(--uui-size-layout-1);
			}
		`,
	];

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
			alias: 'fallBackLanguage',
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
				key: language.isoCode ?? '',
				icon: 'umb:globe',
				data: [
					{
						columnAlias: 'languageName',
						value: {
							name: language.name,
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
						columnAlias: 'fallBackLanguage',
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

	render() {
		return html`
			<umb-body-layout headline="Languages">
				<div id="main">
					<div>
						<uui-button
							label="Add language"
							look="outline"
							color="default"
							href="section/settings/workspace/language/create"></uui-button>
					</div>
					<!--- TODO: investigate if it's possible to use a collection component here --->
					<umb-table .config=${this._tableConfig} .columns=${this._tableColumns} .items=${this._tableItems}></umb-table>
				</div>
			</umb-body-layout>
		`;
	}
}

export default UmbLanguageRootWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-root-workspace': UmbLanguageRootWorkspaceElement;
	}
}
