import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceDictionaryContext } from '../../dictionary-workspace.context';
import { UmbDictionaryDetailStore, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from '../../../dictionary.detail.store';
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

	#detailStore!: UmbDictionaryDetailStore;

	#languages: Array<Language> = [];

	#workspaceContext?: UmbWorkspaceDictionaryContext;

	constructor() {
		super();

		this.consumeContext(UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN, (detailStore) => {
			this.#detailStore = detailStore;
		});

		this.consumeContext('umbWorkspaceContext', async (umbWorkspaceContext: UmbWorkspaceDictionaryContext) => {
			this.#workspaceContext = umbWorkspaceContext;
			this.#languages = await this.#detailStore.getLanguages();
			this.#observeDictionary();
		});
	}

	#observeDictionary() {
		if (!this.#workspaceContext) {
			return;
		}

		this.observe(this.#workspaceContext.data, (dictionary) => {
			if (!dictionary) return;

			// TODO: handle if model is not of the type wanted.
			this._dictionary = dictionary as DictionaryItem;
		});
	}

	#renderTranslation(language: Language) {
		const translation = this._dictionary?.translations?.find(x => x.isoCode === language.isoCode);

		return html`
			<umb-workspace-property
				label="${language.name ?? ''}"
				alias="${language.isoCode ?? ''}"
				property-editor-ui-alias="Umb.PropertyEditorUI.TextArea"
				.value="${translation?.translation ?? ''}"></umb-workspace-property>`;
	}

	render() {
		return html`
			<uui-box>
				<p>Edit the different language versions for the dictionary item '<em>${this._dictionary?.name}</em>' below.</p>
				
				${repeat(
					this.#languages,
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
