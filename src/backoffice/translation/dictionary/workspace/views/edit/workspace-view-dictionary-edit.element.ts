import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceDictionaryContext } from '../../dictionary-workspace.context';
import { UmbDictionaryDetailRepository } from '../../data/dictionary.detail.repository';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryItem, Language } from '@umbraco-cms/backend-api';

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
		});
	}

	#renderTranslation(language: Language) {
		const translation = this._dictionary?.translations?.find(x => x.isoCode === language.isoCode);

		return html`
			<umb-workspace-property
				label="${language.name ?? ''}"
				alias="${language.isoCode ?? ''}"
				property-editor-ui-alias="Umb.PropertyEditorUI.TextArea"
				@change=${this.#onTextareaChange}
				.value="${translation?.translation ?? ''}"></umb-workspace-property>`;
	}

	#onTextareaChange() {
		this.#workspaceContext.setValue(this._dictionary!);
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
