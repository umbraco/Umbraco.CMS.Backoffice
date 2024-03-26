import { css, html, nothing, repeat, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-input-checkbox-list')
export class UmbInputCheckboxListElement extends FormControlMixin(UmbLitElement) {
	// TODO: Could this use a type that we export to ensure TS failure, or hook this up with a type coming from backend?
	@property({ attribute: false })
	public list: Array<{ label: string; value: string; checked: boolean }> = [];

	#selection: Array<string> = [];
	@property({ type: Array })
	public set selection(values: Array<string>) {
		this.#selection = values;
		super.value = values.join(',');
	}
	public get selection(): Array<string> {
		return this.#selection;
	}

	@property()
	public set value(value: string) {
		this.selection = value.split(',');
	}

	protected getFormElement() {
		return undefined;
	}

	#onChange(e: UUIBooleanInputEvent) {
		e.stopPropagation();
		if (e.target.checked) this.selection = [...this.selection, e.target.value];
		else this.#removeFromSelection(this.selection.findIndex((value) => e.target.value === value));

		this.dispatchEvent(new UmbChangeEvent());
	}

	#removeFromSelection(index: number) {
		if (index == -1) return;
		const values = [...this.selection];
		values.splice(index, 1);
		this.selection = values;
	}

	render() {
		if (!this.list) return nothing;
		return html`<form>
			<uui-form @change="${this.#onChange}">
				${repeat(
					this.list,
					(item) => item.value,
					(item) => this.#renderCheckbox(item),
				)}
			</uui-form>
		</form>`;
	}

	#renderCheckbox(item: (typeof this.list)[0]) {
		return html`<uui-checkbox ?checked=${item.checked} label=${item.label} value=${item.value}></uui-checkbox>`;
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
