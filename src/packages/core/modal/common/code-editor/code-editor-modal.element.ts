import { css, html, ifDefined, customElement, query } from '@umbraco-cms/backoffice/external/lit';
import { loadCodeEditor, type UmbCodeEditorElement } from '@umbraco-cms/backoffice/code-editor';
import { UmbCodeEditorModalData, UmbCodeEditorModalValue, UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';

@customElement('umb-code-editor-modal')
export class UmbCodeEditorModalElement extends UmbModalBaseElement<UmbCodeEditorModalData, UmbCodeEditorModalValue> {
	#isCodeEditorReady = new UmbBooleanState(false);
	isCodeEditorReady = this.#isCodeEditorReady.asObservable();

	@query('umb-code-editor')
	_codeEditor?: UmbCodeEditorElement;

	constructor() {
		super();
		this.#loadCodeEditor();
	}

	#handleConfirm() {
		this.value = { content: this._codeEditor?.editor?.monacoEditor?.getValue() ?? '' };
		this.modalContext?.submit();
	}

	#handleCancel() {
		this.modalContext?.reject();
	}

	async #loadCodeEditor() {
		try {
			await loadCodeEditor();
			this.#isCodeEditorReady.setValue(true);
		} catch (error) {
			console.error(error);
		}
	}

	#renderCodeEditor() {
		return html`<umb-code-editor
			language=${ifDefined(this.data?.language)}
			.code=${this.data?.content ?? ''}></umb-code-editor>`;
	}

	#renderLoading() {
		return html`<div id="loader-container">
			<uui-loader></uui-loader>
		</div>`;
	}

	render() {
		return html`
			<umb-body-layout .headline=${this.data?.headline ?? 'Code Editor'}>
				<div id="editor-box">${this.isCodeEditorReady ? this.#renderCodeEditor() : this.#renderLoading()}</div>
				<div slot="actions">
					<uui-button id="cancel" label="Cancel" @click="${this.#handleCancel}">Cancel</uui-button>
					<uui-button
						id="confirm"
						color="${this.data?.color || 'positive'}"
						look="primary"
						label="${this.data?.confirmLabel || 'Submit'}"
						@click=${this.#handleConfirm}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [
		css`
			#editor-box {
				padding: var(--uui-box-default-padding, var(--uui-size-space-5, 18px));
				height: 100%;
				display: flex;
			}

			umb-code-editor {
				width: 100%;
			}
		`,
	];
}

export default UmbCodeEditorModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-code-editor-modal': UmbCodeEditorModalElement;
	}
}
