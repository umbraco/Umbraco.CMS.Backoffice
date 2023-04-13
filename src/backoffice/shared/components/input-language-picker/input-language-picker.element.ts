import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import { UmbLanguageRepository } from '../../../settings/languages/repository/language.repository';
import {
	UmbModalContext,
	UMB_MODAL_CONTEXT_TOKEN,
	UMB_CONFIRM_MODAL,
	UMB_LANGUAGE_PICKER_MODAL,
} from '@umbraco-cms/backoffice/modal';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/events';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { LanguageResponseModel } from '@umbraco-cms/backoffice/backend-api';
import type { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

@customElement('umb-input-language-picker')
export class UmbInputLanguagePickerElement extends FormControlMixin(UmbLitElement) {
	static styles = [
		UUITextStyles,
		css`
			#add-button {
				width: 100%;
			}
		`,
	];
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

	@property({ type: Object, attribute: false })
	public filter: (language: LanguageResponseModel) => boolean = () => true;

	private _selectedIsoCodes: Array<string> = [];
	public get selectedIsoCodes(): Array<string> {
		return this._selectedIsoCodes;
	}
	public set selectedIsoCodes(isoCodes: Array<string>) {
		this._selectedIsoCodes = isoCodes;
		super.value = isoCodes.join(',');
		this._observePickedItems();
	}

	@property()
	public set value(isoCodesString: string) {
		if (isoCodesString !== this._value) {
			this.selectedIsoCodes = isoCodesString.split(/[ ,]+/);
		}
	}

	@state()
	private _items?: Array<LanguageResponseModel>;

	private _modalContext?: UmbModalContext;
	private _repository = new UmbLanguageRepository(this);
	private _pickedItemsObserver?: UmbObserverController<LanguageResponseModel[]>;

	constructor() {
		super();

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this._selectedIsoCodes.length < this.min
		);

		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this._selectedIsoCodes.length > this.max
		);

		this.consumeContext(UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	protected getFormElement() {
		return undefined;
	}

	private async _observePickedItems() {
		this._pickedItemsObserver?.destroy();
		if (!this._repository) return;

		const { asObservable } = await this._repository.requestItems(this._selectedIsoCodes);

		this._pickedItemsObserver = this.observe(asObservable(), (items) => {
			this._items = items;
		});
	}

	private _openPicker() {
		const modalHandler = this._modalContext?.open(UMB_LANGUAGE_PICKER_MODAL, {
			multiple: this.max === 1 ? false : true,
			selection: [...this._selectedIsoCodes],
			filter: this.filter,
		});

		modalHandler?.onSubmit().then(({ selection }) => {
			this._setSelection(selection);
		});
	}

	private _removeItem(item: LanguageResponseModel) {
		const modalHandler = this._modalContext?.open(UMB_CONFIRM_MODAL, {
			color: 'danger',
			headline: `Remove ${item.name}?`,
			content: 'Are you sure you want to remove this item',
			confirmLabel: 'Remove',
		});

		modalHandler?.onSubmit().then(() => {
			const newSelection = this._selectedIsoCodes.filter((value) => value !== item.isoCode);
			this._setSelection(newSelection);
		});
	}

	private _setSelection(newSelection: Array<string>) {
		this.selectedIsoCodes = newSelection;
		this.dispatchEvent(new UmbChangeEvent());
	}

	render() {
		return html`
			${this._items?.map((item) => this._renderItem(item))}
			<uui-button
				id="add-button"
				look="placeholder"
				@click=${this._openPicker}
				label="open"
				?disabled="${this._selectedIsoCodes.length === this.max}"
				>Add</uui-button
			>
		`;
	}

	private _renderItem(item: LanguageResponseModel) {
		return html`
			<!-- TODO: add language ref element -->
			<uui-ref-node name=${ifDefined(item.name === null ? undefined : item.name)} detail=${ifDefined(item.isoCode)}>
				<uui-action-bar slot="actions">
					<uui-button @click=${() => this._removeItem(item)} label="Remove ${item.name}">Remove</uui-button>
				</uui-action-bar>
			</uui-ref-node>
		`;
	}
}

export default UmbInputLanguagePickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-language-picker': UmbInputLanguagePickerElement;
	}
}
