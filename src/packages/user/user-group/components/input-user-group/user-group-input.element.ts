import type { UmbUserGroupItemModel } from '../../repository/index.js';
import { UmbUserGroupPickerContext } from './user-group-input.context.js';
import { css, html, customElement, property, state, ifDefined, nothing } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { splitStringToArray } from '@umbraco-cms/backoffice/utils';

@customElement('umb-user-group-input')
export class UmbUserGroupInputElement extends FormControlMixin(UmbLitElement) {
	/**
	 * This is a minimum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default 0
	 */
	@property({ type: Number })
	public set min(value: number) {
		this.#pickerContext.min = value;
	}
	public get min(): number {
		return this.#pickerContext.min;
	}

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
	 * @default Infinity
	 */
	@property({ type: Number })
	public set max(value: number) {
		this.#pickerContext.max = value;
	}
	public get max(): number {
		return this.#pickerContext.max;
	}

	/**
	 * Max validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	maxMessage = 'This field exceeds the allowed amount of items';

	public set selection(ids: Array<string>) {
		this.#pickerContext.setSelection(ids);
	}
	public get selection(): Array<string> {
		return this.#pickerContext.getSelection();
	}

	@property()
	public set value(idsString: string) {
		// Its with full purpose we don't call super.value, as thats being handled by the observation of the context selection.
		this.selection = splitStringToArray(idsString);
	}
	public get value(): string {
		return this.selection.join(',');
	}

	@state()
	private _items?: Array<UmbUserGroupItemModel>;

	#pickerContext = new UmbUserGroupPickerContext(this);

	constructor() {
		super();

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this.#pickerContext.getSelection().length < this.min,
		);

		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this.#pickerContext.getSelection().length > this.max,
		);

		this.observe(
			this.#pickerContext.selection,
			(selection) => (super.value = selection.join(',')),
			'umbUserGroupInputSelectionObserver',
		);
		this.observe(
			this.#pickerContext.selectedItems,
			(selectedItems) => (this._items = selectedItems),
			'umbUserGroupInputItemsObserver',
		);
	}

	protected getFormElement() {
		return undefined;
	}

	render() {
		return html`
			<uui-ref-list>${this._items?.map((item) => this._renderItem(item))}</uui-ref-list>
			<uui-button id="add-button" look="placeholder" @click=${() => this.#pickerContext.openPicker()} label="open"
				>Add</uui-button
			>
		`;
	}

	private _renderItem(item: UmbUserGroupItemModel) {
		if (!item.unique) return;
		return html`
			<umb-user-group-ref name="${ifDefined(item.name)}">
				${item.icon ? html`<umb-icon slot="icon" name=${item.icon}></umb-icon>` : nothing}

				<uui-action-bar slot="actions">
					<uui-button @click=${() => this.#pickerContext.requestRemoveItem(item.unique)} label="Remove ${item.name}"
						>Remove</uui-button
					>
				</uui-action-bar>
			</umb-user-group-ref>
		`;
	}

	static styles = [
		css`
			#add-button {
				width: 100%;
			}
		`,
	];
}

export default UmbUserGroupInputElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-group-input': UmbUserGroupInputElement;
	}
}
