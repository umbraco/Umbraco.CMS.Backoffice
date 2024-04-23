import { css, html, customElement, property, state, ifDefined, styleMap } from '@umbraco-cms/backoffice/external/lit';
import type { UUITextareaElement } from '@umbraco-cms/backoffice/external/uui';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

@customElement('umb-property-editor-ui-textarea')
export class UmbPropertyEditorUITextareaElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value = '';

	@state()
	private _maxChars?: number;

	@state()
	private _rows?: number;

	@state()
	private _maxHeight?: number;

	@state()
	private _minHeight?: number;

	@state()
	private _css?: any;

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this._maxChars = config?.getValueByAlias('maxChars');
		this._rows = config?.getValueByAlias('rows');
		this._minHeight = config?.getValueByAlias('minHeight');
		this._maxHeight = config?.getValueByAlias('maxHeight');

		this._css = {
			'--uui-textarea-min-height': `${this._minHeight ? `${this._minHeight}px` : 'reset'}`,
			'--uui-textarea-max-height': `${this._maxHeight ? `${this._maxHeight}px` : 'reset'}`,
		};
	}

	private onInput(e: InputEvent) {
		this.value = (e.target as UUITextareaElement).value as string;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html` <uui-textarea
			label="Textarea"
			.value=${this.value ?? ''}
			maxlength="${ifDefined(this._maxChars)}"
			rows="${ifDefined(this._rows)}"
			@input=${this.onInput}
			style="${styleMap(this._css)}"
			auto-height=${this._rows ? false : true}></uui-textarea>`;
	}

	static styles = [
		css`
			uui-textarea {
				width: 100%;
			}
		`,
	];
}

export default UmbPropertyEditorUITextareaElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-textarea': UmbPropertyEditorUITextareaElement;
	}
}
