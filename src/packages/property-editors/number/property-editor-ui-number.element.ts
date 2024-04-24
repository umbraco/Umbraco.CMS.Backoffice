import { css, html, customElement, property, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

@customElement('umb-property-editor-ui-number')
export class UmbPropertyEditorUINumberElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Number })
	value: undefined | number = undefined;

	@state()
	private _max?: number;

	@state()
	private _min?: number;

	@state()
	private _step?: number;

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		this._min = config?.getValueByAlias('min');
		this._max = config?.getValueByAlias('max');
		this._step = config?.getValueByAlias('step');
	}

	private onInput(e: InputEvent) {
		this.value = Number((e.target as HTMLInputElement).value);
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<uui-input
			.value=${this.value ?? 0}
			type="number"
			max="${ifDefined(this._max)}"
			min="${ifDefined(this._min)}"
			step="${ifDefined(this._step)}"
			@input=${this.onInput}></uui-input>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-input {
				width: 100%;
			}
		`,
	];
}

export default UmbPropertyEditorUINumberElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-number': UmbPropertyEditorUINumberElement;
	}
}
