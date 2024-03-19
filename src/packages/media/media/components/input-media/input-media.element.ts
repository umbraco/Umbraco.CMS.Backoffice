import type { UmbMediaItemModel } from '../../repository/index.js';
import { UmbMediaPickerContext } from './input-media.context.js';
import { css, html, customElement, property, state, ifDefined, repeat } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_WORKSPACE_MODAL, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import { type UmbSorterConfig, UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import { splitStringToArray } from '@umbraco-cms/backoffice/utils';

const SORTER_CONFIG: UmbSorterConfig<string> = {
	getUniqueOfElement: (element) => {
		return element.getAttribute('detail');
	},
	getUniqueOfModel: (modelEntry) => {
		return modelEntry;
	},
	identifier: 'Umb.SorterIdentifier.InputMedia',
	itemSelector: 'uui-card-media',
	containerSelector: '.container',
};

@customElement('umb-input-media')
export class UmbInputMediaElement extends FormControlMixin(UmbLitElement) {
	#sorter = new UmbSorterController(this, {
		...SORTER_CONFIG,
		onChange: ({ model }) => {
			this.selection = model;
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

	@property({ type: Array })
	allowedContentTypeIds?: string[] | undefined;

	@property({ type: Boolean })
	showOpenButton?: boolean;

	@property({ type: Boolean })
	ignoreUserStartNodes?: boolean;

	@property()
	public set value(idsString: string) {
		// Its with full purpose we don't call super.value, as thats being handled by the observation of the context selection.
		this.selection = splitStringToArray(idsString);
	}
	public get value() {
		return this.selection.join(',');
	}

	@state()
	private _editMediaPath = '';

	@state()
	private _items?: Array<UmbMediaItemModel>;

	#pickerContext = new UmbMediaPickerContext(this);

	constructor() {
		super();

		new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath('media')
			.onSetup(() => {
				return { data: { entityType: 'media', preset: {} } };
			})
			.observeRouteBuilder((routeBuilder) => {
				this._editMediaPath = routeBuilder({});
			});

		this.observe(this.#pickerContext.selection, (selection) => (super.value = selection.join(',')));
		this.observe(this.#pickerContext.selectedItems, (selectedItems) => (this._items = selectedItems));

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
	}

	protected getFormElement() {
		return undefined;
	}

	#pickableFilter: (item: UmbMediaItemModel) => boolean = (item) => {
		/* TODO: Media item doesn't have the content/media-type ID available to query.
			 Commenting out until the Management API model is updated. [LK]
		*/
		// if (this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0) {
		// 	return this.allowedContentTypeIds.includes(item.contentTypeId);
		// }
		return true;
	};

	#openPicker() {
		// TODO: Configure the media picker, with `allowedContentTypeIds` and `ignoreUserStartNodes` [LK]
		this.#pickerContext.openPicker({
			hideTreeRoot: true,
			pickableFilter: this.#pickableFilter,
		});
	}

	#openItem(item: UmbMediaItemModel) {
		// TODO: Implement the Media editing infinity editor. [LK]
		console.log('TODO: _openItem', item);
	}

	render() {
		return html`<div class="container">${this.#renderItems()} ${this.#renderAddButton()}</div>`;
	}

	#renderItems() {
		if (!this._items) return;
		return html`${repeat(
			this._items,
			(item) => item.unique,
			(item) => this.#renderItem(item),
		)}`;
	}

	#renderAddButton() {
		if (this._items && this.max && this._items.length >= this.max) return;
		return html`
			<uui-button
				id="add-button"
				look="placeholder"
				@click=${this.#openPicker}
				label=${this.localize.term('general_choose')}>
				<uui-icon name="icon-add"></uui-icon>
				${this.localize.term('general_choose')}
			</uui-button>
		`;
	}

	#renderItem(item: UmbMediaItemModel) {
		// TODO: `file-ext` value has been hardcoded here. Find out if API model has value for it. [LK]
		return html`
			<uui-card-media
				name=${ifDefined(item.name === null ? undefined : item.name)}
				detail=${ifDefined(item.unique)}
				file-ext="jpg">
				${this.#renderIsTrashed(item)}
				<uui-action-bar slot="actions">
					${this.#renderOpenButton(item)}
					<uui-button label="Copy media">
						<uui-icon name="icon-documents"></uui-icon>
					</uui-button>
					<uui-button
						@click=${() => this.#pickerContext.requestRemoveItem(item.unique)}
						label="Remove media ${item.name}">
						<uui-icon name="icon-trash"></uui-icon>
					</uui-button>
				</uui-action-bar>
			</uui-card-media>
		`;
	}

	#renderIsTrashed(item: UmbMediaItemModel) {
		if (!item.isTrashed) return;
		return html`<uui-tag size="s" slot="tag" color="danger"
			><umb-localize key="mediaPicker_trashed">Trashed</umb-localize></uui-tag
		>`;
	}

	#renderOpenButton(item: UmbMediaItemModel) {
		if (!this.showOpenButton) return;
		return html`
			<uui-button
				compact
				href="${this._editMediaPath}edit/${item.unique}"
				label=${this.localize.term('general_edit') + ` ${item.name}`}>
				<uui-icon name="icon-edit"></uui-icon>
			</uui-button>
		`;
	}

	static styles = [
		css`
			.container {
				display: grid;
				gap: var(--uui-size-space-3);
				grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
				grid-template-rows: repeat(auto-fill, minmax(160px, 1fr));
			}

			#add-button {
				text-align: center;
				height: 100%;
			}

			uui-icon {
				display: block;
				margin: 0 auto;
			}

			uui-card-media[drag-placeholder] {
				opacity: 0.2;
			}
		`,
	];
}

export default UmbInputMediaElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-media': UmbInputMediaElement;
	}
}
