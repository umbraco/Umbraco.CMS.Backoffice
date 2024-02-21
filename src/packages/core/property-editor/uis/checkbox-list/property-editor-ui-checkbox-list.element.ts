import type { UmbInputCheckboxListElement } from './input-checkbox-list/input-checkbox-list.element.js';
import './input-checkbox-list/input-checkbox-list.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

/**
 * @element umb-property-editor-ui-checkbox-list
 */
@customElement('umb-property-editor-ui-checkbox-list')
export class UmbPropertyEditorUICheckboxListElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#value: Array<string> = [];
	@property({ type: Array })
	public get value(): Array<string> {
		return this.#value;
	}
	public set value(value: Array<string>) {
		this.#value = value ?? [];
	}

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;
		const listData: Record<number, { value: string; sortOrder: number }> | undefined = config.getValueByAlias('items');

		if (!listData) return;

		// formatting the items in the dictionary into an array
		const sortedItems = [];
		const values = Object.values<{ value: string; sortOrder: number }>(listData);
		const keys = Object.keys(listData);
		for (let i = 0; i < values.length; i++) {
			sortedItems.push({ key: keys[i], sortOrder: values[i].sortOrder, value: values[i].value });
		}
		// ensure the items are sorted by the provided sort order
		sortedItems.sort((a, b) => {
			return a.sortOrder > b.sortOrder ? 1 : b.sortOrder > a.sortOrder ? -1 : 0;
		});

		this._list = sortedItems.map((x) => ({ key: x.key, checked: this.#value.includes(x.value), value: x.value }));
	}

	@state()
	private _list: Array<{ key: string; checked: boolean; value: string }> = [];

	#onChange(event: CustomEvent) {
		this.value = (event.target as UmbInputCheckboxListElement).selected;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-checkbox-list
			@change="${this.#onChange}"
			.selectedIds="${this.#value}"
			.list="${this._list}"></umb-input-checkbox-list>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUICheckboxListElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-checkbox-list': UmbPropertyEditorUICheckboxListElement;
	}
}
