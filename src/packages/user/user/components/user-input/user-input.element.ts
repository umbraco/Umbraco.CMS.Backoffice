import type { UmbUserItemModel } from '../../repository/index.js';
import { UmbUserPickerContext } from './user-input.context.js';
import { css, html, customElement, property, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbEntitySelectModel, splitStringToArray } from '@umbraco-cms/backoffice/utils';

@customElement('umb-user-input')
export class UmbUserInputElement extends FormControlMixin(UmbLitElement) {
	/**
	 * This is a minimum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default 0
	 */
	@property({ type: Number })
	public get min(): number {
		return this.#pickerContext.min;
	}
	public set min(value: number) {
		this.#pickerContext.min = value;
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
	public get max(): number {
		return this.#pickerContext.max;
	}
	public set max(value: number) {
		this.#pickerContext.max = value;
	}

	/**
	 * Max validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	maxMessage = 'This field exceeds the allowed amount of items';

	public get selection(): Array<UmbEntitySelectModel> {
		return this.#pickerContext.getSelection();
	}
	public set selection(selection: Array<UmbEntitySelectModel>) {
		this.#pickerContext.setSelection(selection);
	}

	@property()
	public set value(idsString: string) {
		// Its with full purpose we don't call super.value, as thats being handled by the observation of the context selection.
		this.selection = splitStringToArray(idsString);
	}

	@state()
	private _items?: Array<UmbUserItemModel>;

	#pickerContext = new UmbUserPickerContext(this);

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
			'umbUserInputSelectionObserver',
		);
		this.observe(
			this.#pickerContext.selectedItems,
			(selectedItems) => (this._items = selectedItems),
			'umbUserInputItemsObserver',
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

	private _renderItem(item: UmbUserItemModel) {
		if (!item.unique) return;
		return html`
			<uui-ref-node-user name=${ifDefined(item.name)}>
				<uui-action-bar slot="actions">
					<uui-button @click=${() => this.#pickerContext.requestRemoveItem(item.unique)} label="Remove ${item.name}"
						>Remove</uui-button
					>
				</uui-action-bar>
			</uui-ref-node-user>
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

export default UmbUserInputElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-input': UmbUserInputElement;
	}
}
