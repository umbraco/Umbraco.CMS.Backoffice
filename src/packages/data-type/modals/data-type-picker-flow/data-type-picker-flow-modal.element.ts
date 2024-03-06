import { UmbDataTypeTreeRepository } from '../../tree/data-type-tree.repository.js';
import { UMB_DATATYPE_WORKSPACE_MODAL } from '../../workspace/data-type-workspace.modal-token.js';
import { UMB_DATA_TYPE_ENTITY_TYPE } from '../../entity.js';
import { UmbDataTypeCollectionRepository } from '../../collection/index.js';
import { UMB_DATA_TYPE_PICKER_FLOW_DATA_TYPE_PICKER_MODAL } from './data-type-picker-flow-data-type-picker-modal.token.js';
import type {
	UmbDataTypePickerFlowModalData,
	UmbDataTypePickerFlowModalValue,
} from './data-type-picker-flow-modal.token.js';
import { css, html, repeat, customElement, state, when, nothing } from '@umbraco-cms/backoffice/external/lit';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbModalBaseElement, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbDataTypeItemModel } from '@umbraco-cms/backoffice/data-type';
import type { UmbModalRouteBuilder } from '@umbraco-cms/backoffice/modal';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

interface GroupedItems<T> {
	[key: string]: Array<T>;
}
@customElement('umb-data-type-picker-flow-modal')
export class UmbDataTypePickerFlowModalElement extends UmbModalBaseElement<
	UmbDataTypePickerFlowModalData,
	UmbDataTypePickerFlowModalValue
> {
	public set data(value: UmbDataTypePickerFlowModalData) {
		super.data = value;
		this._submitLabel = this.data?.submitLabel ?? this._submitLabel;
	}

	@state()
	private _groupedDataTypes?: GroupedItems<UmbDataTypeItemModel>;

	@state()
	private _groupedPropertyEditorUIs: GroupedItems<ManifestPropertyEditorUi> = {};

	@state()
	private _submitLabel = 'Select';

	@state()
	private _dataTypePickerModalRouteBuilder?: UmbModalRouteBuilder;

	private _createDataTypeModal: UmbModalRouteRegistrationController;

	#collectionRepository;
	#dataTypes: Array<UmbDataTypeItemModel> = [];
	#propertyEditorUIs: Array<ManifestPropertyEditorUi> = [];
	#currentFilterQuery = '';

	constructor() {
		super();

		this.#collectionRepository = new UmbDataTypeCollectionRepository(this);

		new UmbModalRouteRegistrationController(this, UMB_DATA_TYPE_PICKER_FLOW_DATA_TYPE_PICKER_MODAL)
			.addAdditionalPath(':uiAlias')
			.onSetup((routingInfo) => {
				return {
					data: {
						propertyEditorUiAlias: routingInfo.uiAlias,
					},
					value: undefined,
				};
			})
			.onSubmit((submitData) => {
				if (submitData?.dataTypeId) {
					this._select(submitData.dataTypeId);
					this._submitModal();
				} else if (submitData?.createNewWithPropertyEditorUiAlias) {
					this._createDataType(submitData.createNewWithPropertyEditorUiAlias);
				}
			})
			.observeRouteBuilder((routeBuilder) => {
				this._dataTypePickerModalRouteBuilder = routeBuilder;
				this.requestUpdate('_dataTypePickerModalRouteBuilder');
			});

		this._createDataTypeModal = new UmbModalRouteRegistrationController(this, UMB_DATATYPE_WORKSPACE_MODAL)
			.addAdditionalPath(':uiAlias')
			.onSetup((params) => {
				return { data: { entityType: UMB_DATA_TYPE_ENTITY_TYPE, preset: { editorUiAlias: params.uiAlias } } };
			})
			.onSubmit((value) => {
				this._select(value?.unique);
				this._submitModal();
			});

		this.#init();
	}

	private _createDataType(propertyEditorUiAlias: string) {
		// TODO: Could be nice with a more pretty way to prepend to the URL:
		// Open create modal:
		this._createDataTypeModal.open(
			{ uiAlias: propertyEditorUiAlias },
			`create/parent/${UMB_DATA_TYPE_ENTITY_TYPE}/null`,
		);
	}

	async #init() {
		this.observe(
			(await this.#collectionRepository.requestCollection({ skip: 0, take: 100 })).asObservable(),
			(dataTypes) => {
				this.#dataTypes = dataTypes;
				this._performFiltering();
			},
			'_repositoryItemsObserver',
		);

		this.observe(umbExtensionsRegistry.byType('propertyEditorUi'), (propertyEditorUIs) => {
			// Only include Property Editor UIs which has Property Editor Schema Alias
			this.#propertyEditorUIs = propertyEditorUIs.filter(
				(propertyEditorUi) => !!propertyEditorUi.meta.propertyEditorSchemaAlias,
			);
			this._performFiltering();
		});
	}

	private _handleDataTypeClick(dataType: UmbDataTypeItemModel) {
		if (dataType.unique) {
			this._select(dataType.unique);
			this._submitModal();
		}
	}

	private _select(unique: string | undefined) {
		this.value = { selection: unique ? [unique] : [] };
	}

	private _handleFilterInput(event: UUIInputEvent) {
		const query = (event.target.value as string) || '';
		this.#currentFilterQuery = query.toLowerCase();
		this._performFiltering();
	}
	private _performFiltering() {
		if (this.#currentFilterQuery) {
			const filteredDataTypes = this.#dataTypes.filter((dataType) =>
				dataType.name?.toLowerCase().includes(this.#currentFilterQuery),
			);

			/* TODO: data type items doesn't have a group property. We will need a reference to the Property Editor UI to get the group.
			this is a temp solution to group them as uncategorized. The same result as with the lodash groupBy.
			*/
			this._groupedDataTypes = {
				undefined: filteredDataTypes,
			};
		} else {
			this._groupedDataTypes = undefined;
		}

		const filteredUIs = !this.#currentFilterQuery
			? this.#propertyEditorUIs
			: this.#propertyEditorUIs.filter((propertyEditorUI) => {
					return (
						propertyEditorUI.name.toLowerCase().includes(this.#currentFilterQuery) ||
						propertyEditorUI.alias.toLowerCase().includes(this.#currentFilterQuery)
					);
				});

		// TODO: groupBy is not known by TS yet
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this._groupedPropertyEditorUIs = Object.groupBy(
			filteredUIs,
			(propertyEditorUI: ManifestPropertyEditorUi) => propertyEditorUI.meta.group,
		);
	}

	render() {
		return html`
			<umb-body-layout headline="Select editor" class="uui-text">
				<uui-box> ${this._renderFilter()} ${this._renderGrid()} </uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._rejectModal}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	private _renderGrid() {
		return this.#currentFilterQuery ? this._renderFilteredList() : this._renderUIs();
	}

	private _renderFilter() {
		return html` <uui-input
			type="search"
			id="filter"
			@input="${this._handleFilterInput}"
			placeholder="Type to filter..."
			label="Type to filter icons">
			<uui-icon name="search" slot="prepend" id="filter-icon"></uui-icon>
		</uui-input>`;
	}

	private _renderFilteredList() {
		if (!this._groupedDataTypes) return nothing;
		const dataTypesEntries = Object.entries(this._groupedDataTypes);

		if (!this._groupedPropertyEditorUIs) return nothing;

		const editorUIEntries = Object.entries(this._groupedPropertyEditorUIs);

		if (dataTypesEntries.length === 0 && editorUIEntries.length === 0) {
			return html`Nothing matches your search, try another search term.`;
		}

		return html`
			${when(
				dataTypesEntries.length > 0,
				() =>
					html` <h5 class="choice-type-headline">Available configurations</h5>
						${this._renderDataTypes()}`,
			)}
			${when(
				editorUIEntries.length > 0,
				() =>
					html` <h5 class="choice-type-headline">Create a new configuration</h5>
						${this._renderUIs()}`,
			)}
		`;
	}

	private _renderDataTypes() {
		if (!this._groupedDataTypes) return nothing;

		const entries = Object.entries(this._groupedDataTypes);

		// TODO: Fix so we can have Data Types grouped. (or choose not to group them)
		return entries.map(
			([key, value]) =>
				html` <h5 class="category-name">${key === 'undefined' ? 'Uncategorized' : key}</h5>
					${this._renderGroupDataTypes(value)}`,
		);
	}

	private _renderUIs() {
		if (!this._groupedPropertyEditorUIs) return nothing;

		const entries = Object.entries(this._groupedPropertyEditorUIs);

		return entries.map(
			([key, value]) =>
				html` <h5 class="category-name">${key === 'undefined' ? 'Uncategorized' : key}</h5>
					${this._renderGroupUIs(value)}`,
		);
	}

	private _renderGroupUIs(uis: Array<ManifestPropertyEditorUi>) {
		return html` <ul id="item-grid">
			${this._dataTypePickerModalRouteBuilder
				? repeat(
						uis,
						(propertyEditorUI) => propertyEditorUI.alias,
						(propertyEditorUI) =>
							html` <li class="item">
								<uui-button
									type="button"
									label="${propertyEditorUI.meta.label || propertyEditorUI.name}"
									href=${this._dataTypePickerModalRouteBuilder!({ uiAlias: propertyEditorUI.alias })}>
									<div class="item-content">
										<umb-icon name="${propertyEditorUI.meta.icon}" class="icon"></umb-icon>
										${propertyEditorUI.meta.label || propertyEditorUI.name}
									</div>
								</uui-button>
							</li>`,
					)
				: ''}
		</ul>`;
	}

	private _renderGroupDataTypes(dataTypes: Array<UmbDataTypeItemModel>) {
		return html` <ul id="item-grid">
			${repeat(
				dataTypes,
				(dataType) => dataType.unique,
				(dataType) =>
					html`<li class="item" ?selected=${this.value.selection.includes(dataType.unique)}>
						<uui-button .label=${dataType.name} type="button" @click="${() => this._handleDataTypeClick(dataType)}">
							<div class="item-content">
								<uui-icon name="${'icon-bug'}" class="icon"></uui-icon>
								${dataType.name}
							</div>
						</uui-button>
					</li>`,
			)}
		</ul>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#filter {
				width: 100%;
				margin-bottom: var(--uui-size-space-4);
			}

			#filter-icon {
				height: 100%;
				padding-left: var(--uui-size-space-2);
				display: flex;
				color: var(--uui-color-border);
			}

			#item-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
				margin: 0;
				padding: 0;
			}

			#item-grid:not(:last-child) {
				padding-bottom: var(--uui-size-space-5);
			}

			#item-grid .item {
				list-style: none;
				height: 100%;
				width: 100%;
				border: 1px solid transparent;
				border-radius: var(--uui-border-radius);
				box-sizing: border-box;
				color: var(--uui-color-interactive);
			}

			#item-grid .item:hover {
				background: var(--uui-color-surface-emphasis);
				color: var(--uui-color-interactive-emphasis);
				cursor: pointer;
			}

			#item-grid .item uui-button {
				--uui-button-padding-left-factor: 0;
				--uui-button-padding-right-factor: 0;
				--uui-button-padding-top-factor: 0;
				--uui-button-padding-bottom-factor: 0;
				width: 100%;
				height: 100%;
			}

			#item-grid .item .item-content {
				text-align: center;
				box-sizing: border-box;

				padding: var(--uui-size-space-2);

				display: grid;
				grid-template-rows: 40px 1fr;
				height: 100%;
				width: 100%;
			}
			#item-grid .item .icon {
				font-size: 2em;
				margin: auto;
			}

			.category-name {
				text-transform: capitalize;
			}

			.choice-type-headline {
				text-transform: capitalize;
				border-bottom: 1px solid var(--uui-color-divider);
			}
		`,
	];
}

export default UmbDataTypePickerFlowModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-data-type-picker-flow-modal': UmbDataTypePickerFlowModalElement;
	}
}
