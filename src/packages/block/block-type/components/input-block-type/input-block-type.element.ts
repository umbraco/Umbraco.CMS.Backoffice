import type { UmbBlockTypeCardElement } from '../block-type-card/index.js';
import type { UmbBlockTypeBaseModel, UmbBlockTypeWithGroupKey } from '../../types.js';
import {
	UMB_DOCUMENT_TYPE_PICKER_MODAL,
	UMB_MODAL_MANAGER_CONTEXT,
	umbConfirmModal,
} from '@umbraco-cms/backoffice/modal';
import '../block-type-card/index.js';
import { css, html, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';
import { UMB_PROPERTY_DATASET_CONTEXT } from '@umbraco-cms/backoffice/property';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

@customElement('umb-input-block-type')
export class UmbInputBlockTypeElement<
	BlockType extends UmbBlockTypeWithGroupKey = UmbBlockTypeWithGroupKey,
> extends UmbLitElement {
	#sorter = new UmbSorterController<BlockType, UmbBlockTypeCardElement>(this, {
		getUniqueOfElement: (element) => element.contentElementTypeKey!,
		getUniqueOfModel: (modelEntry) => modelEntry.contentElementTypeKey!,
		identifier: 'block-editor-blocks-sorter',
		itemSelector: '.cake',
		containerSelector: '#container',
		resolveVerticalDirection: () => false,
		onChange: ({ model }) => {
			const newGroupKey = this.getAttribute('data-umb-group-key') ?? null;
			this.value = model.map((x) => ({ ...x, groupKey: newGroupKey }));
			this.dispatchEvent(new UmbChangeEvent());
		},
	});

	@property({ type: Array, attribute: false })
	public get value() {
		return this._items;
	}
	public set value(items) {
		this._items = items ?? [];
		this.#sorter.setModel(this._items);
	}

	@property({ type: String })
	workspacePath?: string;

	@state()
	private _items: Array<BlockType> = [];

	#datasetContext?: UmbPropertyDatasetContext;
	#filter: Array<UmbBlockTypeBaseModel> = [];

	constructor() {
		super();
		this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
			this.#datasetContext = instance;
			this.observe(await this.#datasetContext?.propertyValueByAlias('blocks'), (value) => {
				this.#filter = value as Array<UmbBlockTypeBaseModel>;
			});
		});
	}

	async create() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

		// TODO: Make as mode for the Picker Modal, so the click to select immediately submits the modal(And in that mode we do not want to see a Submit button).
		const modalContext = modalManager.open(UMB_DOCUMENT_TYPE_PICKER_MODAL, {
			data: {
				hideTreeRoot: true,
				multiple: false,
				pickableFilter: (docType) =>
					// Only pick elements:
					docType.isElement &&
					// Prevent picking the an already used element type:
					this.#filter &&
					this.#filter.find((x) => x.contentElementTypeKey === docType.unique) === undefined,
			},
		});

		const modalValue = await modalContext?.onSubmit();
		const selectedElementType = modalValue.selection[0];

		if (selectedElementType) {
			this.dispatchEvent(new CustomEvent('create', { detail: { contentElementTypeKey: selectedElementType } }));
		}
	}

	deleteItem(contentElementTypeKey: string) {
		this.value = this.value.filter((x) => x.contentElementTypeKey !== contentElementTypeKey);
		this.dispatchEvent(new UmbChangeEvent());
	}

	protected getFormElement() {
		return undefined;
	}

	async #onRequestDelete(item: BlockType) {
		await umbConfirmModal(this, {
			color: 'danger',
			headline: `Remove [TODO: Get name]?`,
			content: 'Are you sure you want to remove this block type?',
			confirmLabel: 'Remove',
		});
		this.deleteItem(item.contentElementTypeKey);
	}

	render() {
		return html`<div id="container">
			${repeat(this.value, (block) => block.contentElementTypeKey, this.#renderItem)} ${this.#renderButton()}
		</div>`;
	}

	#renderItem = (block: BlockType) => {
		return html`
			<umb-block-type-card
				class="cake"
				.name=${block.label}
				.iconColor=${block.iconColor}
				.backgroundColor=${block.backgroundColor}
				.href="${this.workspacePath}/edit/${block.contentElementTypeKey}"
				.contentElementTypeKey=${block.contentElementTypeKey}>
				<uui-action-bar slot="actions">
					<uui-button @click=${() => this.#onRequestDelete(block)} label="Remove block">
						<uui-icon name="icon-trash"></uui-icon>
					</uui-button>
				</uui-action-bar>
			</umb-block-type-card>
		`;
	};

	#renderButton() {
		return html`
			<uui-button id="add-button" look="placeholder" @click=${() => this.create()} label="open">
				<uui-icon name="icon-add"></uui-icon>
				Add
			</uui-button>
		`;
	}

	static styles = [
		css`
			div {
				display: grid;
				gap: var(--uui-size-space-3);
				grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
				grid-template-rows: repeat(auto-fill, minmax(160px, 1fr));
			}

			#add-button {
				text-align: center;
				min-height: 150px;
				height: 100%;
			}

			uui-icon {
				display: block;
				margin: 0 auto;
			}

			uui-input {
				border: none;
				margin: var(--uui-size-space-6) 0 var(--uui-size-space-4);
			}

			uui-input:hover uui-button {
				opacity: 1;
			}
			uui-input uui-button {
				opacity: 0;
			}

			[drag-placeholder] {
				opacity: 0.2;
			}
		`,
	];
}

export default UmbInputBlockTypeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-block-type': UmbInputBlockTypeElement;
	}
}
