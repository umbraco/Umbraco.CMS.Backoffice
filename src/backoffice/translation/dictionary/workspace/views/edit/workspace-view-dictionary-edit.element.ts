import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbLitElement } from '@umbraco-cms/element';
import { DictionaryItem, DictionaryItemTranslationModel } from '@umbraco-cms/backend-api';
import { UmbWorkspaceDictionaryContext } from '../../dictionary-workspace.context';

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
	_dictionary?: DictionaryItem;

	private _workspaceContext?: UmbWorkspaceDictionaryContext;

	constructor() {
		super();

		this.consumeContext('umbWorkspaceContext', (umbWorkspaceContext: UmbWorkspaceDictionaryContext) => {
			this._workspaceContext = umbWorkspaceContext;
			this._observeDictionary();
		});
	}

	private _observeDictionary() {
		if (!this._workspaceContext) {
			return;
		}

		this.observe(this._workspaceContext.data, (dictionary) => {
			if (!dictionary) return;

			// TODO: handle if model is not of the type wanted.
			this._dictionary = dictionary as DictionaryItem;
		});
	}

	// TODO => model does not provide the culture name, only code
	private _renderTranslation(translation: DictionaryItemTranslationModel) {
		return html`
			<umb-workspace-property
				label="${translation.isoCode ?? ''}"
				alias="${translation.isoCode ?? ''}"
				property-editor-ui-alias="Umb.PropertyEditorUI.TextArea"
				.value="${translation.translation}"></umb-workspace-property>`;
	}

	render() {
		return html`
			<uui-box>
				<p>Edit the different language versions for the dictionary item '<em>${this._dictionary?.name}</em>' below.</p>
				
				${repeat(
					this._dictionary?.translations ?? [],
					(item) => item.isoCode,
					(item) => this._renderTranslation(item)
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
