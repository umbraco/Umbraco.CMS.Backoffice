import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceDictionaryContext } from '../../dictionary-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { DictionaryTranslation } from '@umbraco-cms/backend-api';

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
	_dictionary?: DictionaryDetails;

	private _workspaceContext?: UmbWorkspaceDictionaryContext;

	constructor() {
		super();

		this.consumeContext('umbWorkspaceContext', (umbWorkspaceContext) => {
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
			this._dictionary = dictionary as DictionaryDetails;
		});
	}

	private _renderTranslation(translation: DictionaryTranslation) {
		return html`
			<umb-entity-property
				label="${translation.displayName ?? ''}"
				alias="${translation.isoCode ?? ''}"
				property-editor-ui-alias="Umb.PropertyEditorUI.TextArea"
				.value="${translation.translation}"></umb-entity-property>`;
	}

	render() {
		return html`
			<uui-box>
				<p>Edit the different language versions for the dictionary item '<em>${this._dictionary?.name}</em>' below.</p>
				
				${repeat(
					this._dictionary?.translations ?? [],
					(item) => item.key,
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
