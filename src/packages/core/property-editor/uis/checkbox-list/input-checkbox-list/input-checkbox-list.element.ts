import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { css, html, nothing, repeat, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-input-checkbox-list')
export class UmbInputCheckboxListElement extends FormControlMixin(UmbLitElement) {
	/**
	 * List of items.
	 */
	// TODO: Could this use a type that we export to ensure TS failure,  or hook this up with a type coming from backend?
	@property({ attribute: false })
	public list: Array<{ key: string; checked: boolean; value: string }> = [];

	#selected: Array<string> = [];
	public get selected(): Array<string> {
		return this.#selected;
	}
	public set selected(keys: Array<string>) {
		this.#selected = keys;
		super.value = keys.join(',');
	}

	@property()
	public set value(keysString: string) {
		if (keysString !== this._value) {
			this.selected = keysString.split(/[ ,]+/);
		}
	}

	protected getFormElement() {
		return undefined;
	}

	#setSelection(e: UUIBooleanInputEvent) {
		e.stopPropagation();
		if (e.target.checked) this.selected = [...this.selected, e.target.value];
		else this.#removeFromSelection(this.selected.findIndex((key) => e.target.value === key));

		this.dispatchEvent(new UmbChangeEvent());
	}

	#removeFromSelection(index: number) {
		if (index == -1) return;
		const keys = [...this.selected];
		keys.splice(index, 1);
		this.selected = keys;
	}

	render() {
		if (!this.list) return nothing;
		return html`<form>
			<uui-form @change="${this.#setSelection}">
				${repeat(this.list, (item) => item.key, this.renderCheckbox)}
			</uui-form>
		</form>`;
	}

	renderCheckbox(item: { key: string; checked: boolean; value: string }) {
		return html`<uui-checkbox value="${item.value}" label="${item.value}" ?checked="${item.checked}"></uui-checkbox>`;
	}

	static styles = [
		css`
			uui-checkbox {
				width: 100%;
			}
		`,
	];
}

export default UmbInputCheckboxListElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-checkbox-list': UmbInputCheckboxListElement;
	}
}
