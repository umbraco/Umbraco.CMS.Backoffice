import type { UmbInputRadioButtonListElement } from '../../../components/input-radio-button-list/input-radio-button-list.element.js';
import '../../../components/input-radio-button-list/input-radio-button-list.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/**
 * @element umb-property-editor-ui-radio-button-list
 */
@customElement('umb-property-editor-ui-radio-button-list')
export class UmbPropertyEditorUIRadioButtonListElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#value = '';
	@property({ type: String })
	public get value(): string {
		return this.#value;
	}
	public set value(value: string | undefined) {
		this.#value = value?.trim() || '';
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

		this._list = sortedItems;
	}

	@state()
	private _list: Array<{ key: string; sortOrder: number; value: string }> = [];

	#onChange(event: CustomEvent) {
		this.value = (event.target as UmbInputRadioButtonListElement).selected;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-radio-button-list
			@change="${this.#onChange}"
			.selectedKey="${this.#value}"
			.list="${this._list}"></umb-input-radio-button-list>`;
	}

	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUIRadioButtonListElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-radio-button-list': UmbPropertyEditorUIRadioButtonListElement;
	}
}
