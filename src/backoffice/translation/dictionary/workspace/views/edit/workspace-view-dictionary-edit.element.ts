import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceDictionaryContext } from '../../dictionary-workspace.context';
import { UmbDictionaryDetailRepository } from '../../data/dictionary.detail.repository';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryItem, DictionaryItemTranslationModel, Language } from '@umbraco-cms/backend-api';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { UUITextareaElement, UUITextareaEvent } from '@umbraco-ui/uui';

@customElement('umb-workspace-view-dictionary-edit')
export class UmbWorkspaceViewDictionaryEditElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
		`,
	];

	@state()
	private _dictionary?: DictionaryItem;

	#detailRepo!: UmbDictionaryDetailRepository;

	@state()
	private _languages: Array<Language> = [];

	#workspaceContext!: UmbWorkspaceDictionaryContext;

	#translations: Array<DictionaryItemTranslationModel> = [];

	async connectedCallback() {
		super.connectedCallback();

		this.#detailRepo = new UmbDictionaryDetailRepository(this);
		this._languages = await this.#detailRepo.getLanguages();

		this.consumeContext<UmbWorkspaceDictionaryContext>('umbWorkspaceContext', (_instance) => {
			this.#workspaceContext = _instance;
			this.#observeDictionary();
		});
	}

	#observeDictionary() {
		this.observe(this.#workspaceContext.dictionary, (dictionary) => {
			this._dictionary = dictionary;
			this.#translations = [...(dictionary?.translations ?? [])];
		});
	}

	#renderTranslation(language: Language) {
		if (!language.isoCode) return;

		const translation = this.#translations?.find((x) => x.isoCode === language.isoCode);

		return html` <umb-workspace-property-layout label=${language.name ?? language.isoCode}>
			<uui-textarea
				slot="editor"
				name=${language.isoCode}
				label="translation"
				@change=${this.#onTextareaChange}
				value=${ifDefined(translation?.translation)}></uui-textarea>
		</umb-workspace-property-layout>`;
	}

	#onTextareaChange(e: Event) {
		if (e instanceof UUITextareaEvent) {
			const target = e.composedPath()[0] as UUITextareaElement;
			const translation = target.value.toString();
			const isoCode = target.getAttribute('name')!;			

			this.#workspaceContext.setTranslation(isoCode, translation);
		}
	}

	render() {
		return html`
			<uui-box>
				<p>Edit the different language versions for the dictionary item '<em>${this._dictionary?.name}</em>' below.</p>

				${repeat(
					this._languages,
					(item) => item.isoCode,
					(item) => this.#renderTranslation(item)
				)}
			</uui-box>
		`;
	}
}

export default UmbWorkspaceViewDictionaryEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-dictionary-edit': UmbWorkspaceViewDictionaryEditElement;
	}
}
