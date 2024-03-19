import { css, html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-input-toggle')
export class UmbInputToggleElement extends FormControlMixin(UmbLitElement) {
	_checked = false;
	@property({ type: Boolean })
	public set checked(toggle: boolean) {
		this._checked = toggle;
		super.value = toggle.toString();
		this.#updateLabel();
	}
	public get checked(): boolean {
		return this._checked;
	}

	@property({ type: Boolean })
	showLabels = false;

	@property({ type: String })
	labelOn?: string;

	@property({ type: String })
	labelOff?: string;

	@state()
	_currentLabel?: string;

	protected getFormElement() {
		return undefined;
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.#updateLabel();
	}

	#onChange(e: UUIBooleanInputEvent) {
		this.checked = e.target.checked;
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	#updateLabel() {
		this._currentLabel = this.showLabels ? (this.checked ? this.labelOn : this.labelOff) : '';
	}

	render() {
		return html`<uui-toggle
			.checked="${this._checked}"
			.label="${this._currentLabel}"
			@change="${this.#onChange}"></uui-toggle>`;
	}

	static styles = [
		css`
			uui-toggle {
				width: 100%;
			}
		`,
	];
}

export default UmbInputToggleElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-toggle': UmbInputToggleElement;
	}
}
