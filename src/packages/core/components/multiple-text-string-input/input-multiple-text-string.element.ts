import type { UmbInputMultipleTextStringItemElement } from './input-multiple-text-string-item.element.js';
import { css, html, nothing, repeat, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import type { UmbInputEvent, UmbDeleteEvent } from '@umbraco-cms/backoffice/event';

/**
 * @element umb-input-multiple-text-string
 */
@customElement('umb-input-multiple-text-string')
export class UmbInputMultipleTextStringElement extends FormControlMixin(UmbLitElement) {
	#sorter = new UmbSorterController(this, {
		getUniqueOfElement: (element) => {
			return element.getAttribute('data-sort-entry-id');
		},
		getUniqueOfModel: (modelEntry: string) => {
			return modelEntry;
		},
		identifier: 'Umb.SorterIdentifier.ColorEditor',
		itemSelector: 'umb-input-multiple-text-string-item',
		containerSelector: '#sorter-wrapper',
		onChange: ({ model }) => {
			const oldValue = this._items;
			this._items = model;
			this.requestUpdate('_items', oldValue);
		},
	});

	/**
	 * This is a minimum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	min?: number;

	/**
	 * Min validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	minMessage = 'This field need more items';

	/**
	 * This is a maximum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	max?: number;

	/**
	 * Max validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	maxMessage = 'This field exceeds the allowed amount of items';

	/**
	 * Disables the input
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false;

	/**
	 * Makes the input readonly
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	readonly = false;

	constructor() {
		super();

		// TODO: we need a way to overwrite the missing value validator. Se we can validate on other properties than value
		/*
		this.removeValidator('valueMissing');

		this.addValidator(
			'valueMissing',
			() => this.requiredMessage,
			() => this.items.length > 0
		);
		*/

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this._items.length < this.min,
		);
		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this._items.length > this.max,
		);
	}

	@state()
	private _items: Array<string> = [];

	@property({ type: Array })
	public get items(): Array<string> {
		return this._items;
	}
	public set items(items: Array<string>) {
		// TODO: when we have a way to overwrite the missing value validator we can remove this
		this.value = items?.length > 0 ? 'some value' : '';
		this._items = items ?? [];
		this.#sorter.setModel(this.items);
	}

	// TODO: Some inputs might not have a value that is either FormDataEntryValue or FormData.
	//  How do we handle this?
	/*
	@property()
	public get value() {
		throw new Error(`${this} does not support to get the value directly. Use items instead.`);
	}
	public set value(value: FormDataEntryValue | FormData) {
		throw new Error(`${this} does not support to set the value directly. Use items instead.`);
	}
	*/

	#onAdd() {
		this._items = [...this._items, ''];
		this.pristine = false;
		this.dispatchEvent(new UmbChangeEvent());
		this.#focusNewItem();
	}

	#onInput(event: UmbInputEvent, currentIndex: number) {
		event.stopPropagation();
		const target = event.currentTarget as UmbInputMultipleTextStringItemElement;
		const value = target.value as string;
		this._items = this._items.map((item, index) => (index === currentIndex ? value : item));
		this.dispatchEvent(new UmbChangeEvent());
	}

	async #focusNewItem() {
		await this.updateComplete;
		const items = this.shadowRoot?.querySelectorAll(
			'umb-input-multiple-text-string-item',
		) as NodeListOf<UmbInputMultipleTextStringItemElement>;
		const newItem = items[items.length - 1];
		newItem.focus();
	}

	#deleteItem(event: UmbDeleteEvent, itemIndex: number) {
		event.stopPropagation();
		this._items = this._items.filter((item, index) => index !== itemIndex);
		this.pristine = false;
		this.dispatchEvent(new UmbChangeEvent());
	}

	protected getFormElement() {
		return undefined;
	}

	render() {
		return html`<div id="sorter-wrapper">${this.#renderItems()}</div>
			${this.#renderAddButton()} `;
	}

	#renderItems() {
		return html`
			${repeat(
				this._items,
				(item, index) => index,
				(item, index) =>
					html` <umb-input-multiple-text-string-item
						value=${item}
						name="item-${index}"
						data-sort-entry-id=${item}
						@input=${(event: UmbInputEvent) => this.#onInput(event, index)}
						@delete="${(event: UmbDeleteEvent) => this.#deleteItem(event, index)}"
						?disabled=${this.disabled}
						?readonly=${this.readonly}
						required
						required-message="Item ${index + 1} is missing a value"></umb-input-multiple-text-string-item>`,
			)}
		`;
	}

	#renderAddButton() {
		return html`
			${this.disabled || this.readonly
				? nothing
				: html`<uui-button
						id="action"
						label="Add"
						look="placeholder"
						color="default"
						@click="${this.#onAdd}"
						?disabled=${this.disabled}></uui-button>`}
		`;
	}

	static styles = [
		css`
			#action {
				display: block;
			}

			.--umb-sorter-placeholder {
				position: relative;
				visibility: hidden;
			}
			.--umb-sorter-placeholder::after {
				content: '';
				position: absolute;
				inset: 0px;
				border-radius: var(--uui-border-radius);
				border: 1px dashed var(--uui-color-divider-emphasis);
			}
		`,
	];
}

export default UmbInputMultipleTextStringElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-multiple-text-string': UmbInputMultipleTextStringElement;
	}
}
