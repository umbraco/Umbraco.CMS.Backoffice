import { UmbDocumentItemRepository } from '../../repository/index.js';
import type { UmbDocumentItemModel } from '../../repository/item/types.js';
import type { PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { css, html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import { UMB_MODAL_MANAGER_CONTEXT, UMB_DOCUMENT_PICKER_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import { splitStringToArray } from '@umbraco-cms/backoffice/utils';

@customElement('umb-input-document-granular-permission')
export class UmbInputDocumentGranularPermissionElement extends FormControlMixin(UmbLitElement) {
	private _selectedIds: Array<string> = [];
	public get selectedIds(): Array<string> {
		return this._selectedIds;
	}
	public set selectedIds(ids: Array<string>) {
		this._selectedIds = ids;
		super.value = ids.join(',');
		this.#observePickedDocuments();
	}

	@property()
	public set value(idsString: string) {
		if (idsString !== this._value) {
			this.selectedIds = splitStringToArray(idsString);
		}
	}

	@state()
	private _items?: Array<UmbDocumentItemModel>;

	#documentItemRepository = new UmbDocumentItemRepository(this);
	#modalContext?: UmbModalManagerContext;
	#pickedItemsObserver?: UmbObserverController<Array<UmbDocumentItemModel>>;

	constructor() {
		super();
		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => (this.#modalContext = instance));
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);
		this.#observePickedDocuments();
	}

	protected getFormElement() {
		return undefined;
	}

	async #observePickedDocuments() {
		this.#pickedItemsObserver?.destroy();

		const { asObservable } = await this.#documentItemRepository.requestItems(this._selectedIds);
		this.#pickedItemsObserver = this.observe(asObservable(), (items) => (this._items = items));
	}

	#openDocumentPicker() {
		// We send a shallow copy(good enough as its just an array of ids) of our this._selectedIds, as we don't want the modal to manipulate our data:
		// TODO: Use value instead:
		const modalContext = this.#modalContext?.open(UMB_DOCUMENT_PICKER_MODAL, {
			value: {
				selection: [...this._selectedIds],
			},
		});

		//modalContext?.onSubmit().then((value) => {
		//this.#setSelection(selection);
		//});
	}

	#setSelection(newSelection: Array<string>) {
		this.selectedIds = newSelection;
		this.dispatchEvent(new UmbChangeEvent());
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.#pickedItemsObserver?.destroy();
	}

	render() {
		return html`
			${this._items?.map((item) => this.#renderItem(item))}
			<uui-button id="add-button" look="placeholder" @click=${this.#openDocumentPicker} label="open">Add</uui-button>
		`;
	}

	#renderItem(item: UmbDocumentItemModel) {
		return html` <div>Render something here ${item.unique}</div> `;
	}

	static styles = [
		css`
			#add-button {
				width: 100%;
			}
		`,
	];
}

export default UmbInputDocumentGranularPermissionElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-document-granular-permission': UmbInputDocumentGranularPermissionElement;
	}
}
