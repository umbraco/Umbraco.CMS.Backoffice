import type { UmbMemberItemModel } from '../../repository/index.js';
import { UmbMemberPickerContext } from './input-member.context.js';
import { css, customElement, html, nothing, property, repeat, state } from '@umbraco-cms/backoffice/external/lit';
import { splitStringToArray } from '@umbraco-cms/backoffice/utils';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbModalRouteRegistrationController, UMB_WORKSPACE_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import { UUIFormControlMixin } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-input-member')
export class UmbInputMemberElement extends UUIFormControlMixin(UmbLitElement, '') {
	#sorter = new UmbSorterController<string>(this, {
		getUniqueOfElement: (element) => {
			return element.id;
		},
		getUniqueOfModel: (modelEntry) => {
			return modelEntry;
		},
		identifier: 'Umb.SorterIdentifier.InputMember',
		itemSelector: 'uui-ref-node',
		containerSelector: 'uui-ref-list',
		onChange: ({ model }) => {
			this.selection = model;
			this.dispatchEvent(new UmbChangeEvent());
		},
	});

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
		this.#sorter.setModel(ids);
	}
	public get selection(): Array<string> {
		return this.#pickerContext.getSelection();
	}

	@property({ type: Boolean })
	showOpenButton?: boolean;

	@property({ type: Array })
	allowedContentTypeIds?: string[] | undefined;

	@property()
	public set value(idsString: string) {
		this.selection = splitStringToArray(idsString);
	}
	public get value(): string {
		return this.selection.join(',');
	}

	@property({ type: Object, attribute: false })
	public filter: (member: UmbMemberItemModel) => boolean = () => true;

	@state()
	private _editMemberPath = '';

	@state()
	private _items?: Array<UmbMemberItemModel>;

	#pickerContext = new UmbMemberPickerContext(this);

	constructor() {
		super();

		new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath('member')
			.onSetup(() => {
				return { data: { entityType: 'member', preset: {} } };
			})
			.observeRouteBuilder((routeBuilder) => {
				this._editMemberPath = routeBuilder({});
			});

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

		this.observe(this.#pickerContext.selection, (selection) => (this.value = selection.join(',')), '_observeSelection');
		this.observe(this.#pickerContext.selectedItems, (selectedItems) => (this._items = selectedItems), '_observeItems');
	}

	protected getFormElement() {
		return undefined;
	}

	#pickableFilter: (item: UmbMemberItemModel) => boolean = (item) => {
		if (this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0) {
			return this.allowedContentTypeIds.includes(item.memberType.unique);
		}
		return true;
	};

	#openPicker() {
		this.#pickerContext.openPicker({
			filter: this.filter,
			pickableFilter: this.#pickableFilter,
		});
	}

	#removeItem(item: UmbMemberItemModel) {
		this.#pickerContext.requestRemoveItem(item.unique);
	}

	render() {
		return html`${this.#renderItems()} ${this.#renderAddButton()}`;
	}

	#renderItems() {
		if (!this._items) return nothing;
		return html`
			<uui-ref-list>
				${repeat(
					this._items,
					(item) => item.unique,
					(item) => this.#renderItem(item),
				)}
			</uui-ref-list>
		`;
	}

	#renderAddButton() {
		if (this.max === 1 && this.selection.length >= this.max) return nothing;
		return html`<uui-button
			id="btn-add"
			look="placeholder"
			@click=${this.#openPicker}
			label=${this.localize.term('general_choose')}></uui-button>`;
	}

	#renderItem(item: UmbMemberItemModel) {
		if (!item.unique) return nothing;
		return html`
			<uui-ref-node name=${item.name} id=${item.unique}>
				<uui-action-bar slot="actions">
					${this.#renderOpenButton(item)}
					<uui-button @click=${() => this.#removeItem(item)} label=${this.localize.term('general_remove')}></uui-button>
				</uui-action-bar>
			</uui-ref-node>
		`;
	}

	#renderOpenButton(item: UmbMemberItemModel) {
		if (!this.showOpenButton) return nothing;
		return html`
			<uui-button
				href="${this._editMemberPath}edit/${item.unique}"
				label="${this.localize.term('general_open')} ${item.name}">
				${this.localize.term('general_open')}
			</uui-button>
		`;
	}

	static styles = [
		css`
			#btn-add {
				width: 100%;
			}

			uui-ref-node[drag-placeholder] {
				opacity: 0.2;
			}
		`,
	];
}

export default UmbInputMemberElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-member': UmbInputMemberElement;
	}
}
