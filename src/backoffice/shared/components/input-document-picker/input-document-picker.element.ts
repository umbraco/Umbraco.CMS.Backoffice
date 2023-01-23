import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from 'src/core/modal';
import type { FolderTreeItem } from '@umbraco-cms/backend-api';
import { UmbLitElement } from '@umbraco-cms/element';
import type { UmbObserverController } from '@umbraco-cms/observable-api';
import { UmbDocumentStore, UMB_DOCUMENT_STORE_CONTEXT_TOKEN } from 'src/backoffice/documents/documents/document.store';

@customElement('umb-input-document-picker')
export class UmbInputDocumentPickerElement extends FormControlMixin(UmbLitElement) {
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

	private _selectedKeys: Array<string> = [];
	public get selectedKeys(): Array<string> {
		return this._selectedKeys;
	}
	public set selectedKeys(keys: Array<string>) {
		this._selectedKeys = keys;
		super.value = keys.join(',');
		this._observePickedDocuments();
	}

	@property()
	public set value(keysString: string) {
		if (keysString !== this._value) {
			this.selectedKeys = keysString.split(/[ ,]+/);
		}
	}

	@state()
	private _items?: Array<FolderTreeItem>;

	private _modalService?: UmbModalService;
	private _documentStore?: UmbDocumentStore;
	private _pickedItemsObserver?: UmbObserverController<FolderTreeItem>;

	constructor() {
		super();

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this._selectedKeys.length < this.min
		);
		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this._selectedKeys.length > this.max
		);

		this.consumeContext(UMB_DOCUMENT_STORE_CONTEXT_TOKEN, (instance) => {
			this._documentStore = instance;
			this._observePickedDocuments();
		});
		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (instance) => {
			this._modalService = instance;
		});
	}

	protected getFormElement() {
		return undefined;
	}

	private _observePickedDocuments() {
		this._pickedItemsObserver?.destroy();

		if (!this._documentStore) return;

		// TODO: consider changing this to the list data endpoint when it is available
		this._pickedItemsObserver = this.observe(this._documentStore.getTreeItems(this._selectedKeys), (items) => {
			this._items = items;
		});
	}

	private _openPicker() {
		// We send a shallow copy(good enough as its just an array of keys) of our this._selectedKeys, as we don't want the modal to manipulate our data:
		const modalHandler = this._modalService?.contentPicker({ multiple: true, selection: [...this._selectedKeys] });
		modalHandler?.onClose().then(({ selection }: any) => {
			this._setSelection(selection);
		});
	}

	private _removeItem(item: FolderTreeItem) {
		const modalHandler = this._modalService?.confirm({
			color: 'danger',
			headline: `Remove ${item.name}?`,
			content: 'Are you sure you want to remove this item',
			confirmLabel: 'Remove',
		});

		modalHandler?.onClose().then(({ confirmed }) => {
			if (confirmed) {
				const newSelection = this._selectedKeys.filter((value) => value !== item.key);
				this._setSelection(newSelection);
			}
		});
	}

	private _setSelection(newSelection: Array<string>) {
		this.selectedKeys = newSelection;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
	}

	render() {
		return html`
			${this._items?.map((item) => this._renderItem(item))}
			<uui-button id="add-button" look="placeholder" @click=${this._openPicker} label="open">Add</uui-button>
		`;
	}

	private _renderItem(item: FolderTreeItem) {
		// TODO: remove when we have a way to handle trashed items
		const tempItem = item as FolderTreeItem & { isTrashed: boolean };

		return html`
			<uui-ref-node name=${ifDefined(item.name === null ? undefined : item.name)} detail=${ifDefined(item.key)}>
				${tempItem.isTrashed ? html` <uui-tag size="s" slot="tag" color="danger">Trashed</uui-tag> ` : nothing}
				<uui-action-bar slot="actions">
					<uui-button @click=${() => this._removeItem(item)} label="Remove document ${item.name}">Remove</uui-button>
				</uui-action-bar>
			</uui-ref-node>
		`;
	}
}

export default UmbInputDocumentPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-document-picker': UmbInputDocumentPickerElement;
	}
}
