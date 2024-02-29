import type { UmbDocumentTypeWorkspaceContext } from '../../document-type-workspace.context.js';
import './document-type-workspace-view-edit-property.element.js';
import type { UmbDocumentTypeDetailModel } from '../../../types.js';
import type { UmbDocumentTypeWorkspacePropertyElement } from './document-type-workspace-view-edit-property.element.js';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { css, html, customElement, property, state, repeat, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyContainerTypes, UmbPropertyTypeModel } from '@umbraco-cms/backoffice/content-type';
import { UmbContentTypePropertyStructureHelper } from '@umbraco-cms/backoffice/content-type';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { UMB_PROPERTY_SETTINGS_MODAL, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';

@customElement('umb-document-type-workspace-view-edit-properties')
export class UmbDocumentTypeWorkspaceViewEditPropertiesElement extends UmbLitElement {
	#sorter = new UmbSorterController<UmbPropertyTypeModel, UmbDocumentTypeWorkspacePropertyElement>(this, {
		getUniqueOfElement: (element) => {
			return element.getAttribute('data-umb-property-id');
		},
		getUniqueOfModel: (modelEntry) => {
			return modelEntry.id;
		},
		identifier: 'document-type-property-sorter',
		itemSelector: 'umb-document-type-workspace-view-edit-property',
		//disabledItemSelector: '[inherited]',
		//TODO: Set the property list (sorter wrapper) to inherited, if its inherited
		// This is because we don't want to move local properties into an inherited group container.
		// Or maybe we do, but we still need to check if the group exists locally, if not, then it needs to be created before we move a property into it.
		// TODO: Fix bug where a local property turn into an inherited when moved to a new group container.
		containerSelector: '#property-list',
		onChange: ({ model }) => {
			this._propertyStructure = model;
		},
		onEnd: ({ item }) => {
			/** Explanation: If the item is the first in list, we compare it to the item behind it to set a sortOrder.
			 * If it's not the first in list, we will compare to the item in before it, and check the following item to see if it caused overlapping sortOrder, then update
			 * the overlap if true, which may cause another overlap, so we loop through them till no more overlaps...
			 */
			const model = this._propertyStructure;
			const newIndex = model.findIndex((entry) => entry.id === item.id);

			// Doesn't exist in model
			if (newIndex === -1) return;

			// First in list
			if (newIndex === 0 && model.length > 1) {
				this._propertyStructureHelper.partialUpdateProperty(item.id, {
					sortOrder: model[1].sortOrder - 1,
					container: this._containerId ? { id: this._containerId } : null,
				});
				return;
			}

			// Not first in list
			if (newIndex > 0 && model.length > 1) {
				const prevItemSortOrder = model[newIndex - 1].sortOrder;

				let weight = 1;
				this._propertyStructureHelper.partialUpdateProperty(item.id, {
					sortOrder: prevItemSortOrder + weight,
					container: this._containerId ? { id: this._containerId } : null,
				});

				// Check for overlaps
				model.some((entry, index) => {
					if (index <= newIndex) return;
					if (entry.sortOrder === prevItemSortOrder + weight) {
						weight++;
						this._propertyStructureHelper.partialUpdateProperty(entry.id, { sortOrder: prevItemSortOrder + weight });
					}
					// Break the loop
					return true;
				});
			}
		},
	});

	private _containerId: string | undefined;

	@property({ type: String, attribute: 'container-id', reflect: false })
	public get containerId(): string | undefined {
		return this._containerId;
	}
	public set containerId(value: string | undefined) {
		if (value === this._containerId) return;
		const oldValue = this._containerId;
		this._containerId = value;
		this.requestUpdate('containerId', oldValue);
	}

	@property({ type: String, attribute: 'container-name', reflect: false })
	public get containerName(): string | undefined {
		return this._propertyStructureHelper.getContainerName();
	}
	public set containerName(value: string | undefined) {
		this._propertyStructureHelper.setContainerName(value);
	}

	@property({ type: String, attribute: 'container-type', reflect: false })
	public get containerType(): UmbPropertyContainerTypes | undefined {
		return this._propertyStructureHelper.getContainerType();
	}
	public set containerType(value: UmbPropertyContainerTypes | undefined) {
		this._propertyStructureHelper.setContainerType(value);
	}

	_propertyStructureHelper = new UmbContentTypePropertyStructureHelper<UmbDocumentTypeDetailModel>(this);

	@state()
	_propertyStructure: Array<UmbPropertyTypeModel> = [];

	@state()
	_ownerDocumentTypes?: UmbDocumentTypeDetailModel[];

	@state()
	protected _modalRouteNewProperty?: string;

	@state()
	_sortModeActive?: boolean;

	constructor() {
		super();

		this.#sorter.disable();

		this.consumeContext(UMB_WORKSPACE_CONTEXT, async (workspaceContext) => {
			this._propertyStructureHelper.setStructureManager(
				(workspaceContext as UmbDocumentTypeWorkspaceContext).structure,
			);
			this.observe(
				(workspaceContext as UmbDocumentTypeWorkspaceContext).isSorting,
				(isSorting) => {
					this._sortModeActive = isSorting;
					if (isSorting) {
						this.#sorter.enable();
					} else {
						this.#sorter.disable();
					}
				},
				'_observeIsSorting',
			);
			const docTypesObservable = await this._propertyStructureHelper.ownerDocumentTypes();
			if (!docTypesObservable) return;
			this.observe(
				docTypesObservable,
				(documents) => {
					this._ownerDocumentTypes = documents;
				},
				'observeOwnerDocumentTypes',
			);
		});
		this.observe(this._propertyStructureHelper.propertyStructure, (propertyStructure) => {
			this._propertyStructure = propertyStructure;
			this.#sorter.setModel(this._propertyStructure);
		});

		// Note: Route for adding a new property
		new UmbModalRouteRegistrationController(this, UMB_PROPERTY_SETTINGS_MODAL)
			.addAdditionalPath('new-property')
			.onSetup(async () => {
				const documentTypeId = this._ownerDocumentTypes?.find(
					(types) => types.containers?.find((containers) => containers.id === this.containerId),
				)?.unique;
				if (documentTypeId === undefined) return false;
				const propertyData = await this._propertyStructureHelper.createPropertyScaffold(this._containerId);
				if (propertyData === undefined) return false;
				return { data: { documentTypeId }, value: propertyData };
			})
			.onSubmit((value) => {
				this.#addProperty(value as UmbPropertyTypeModel);
			})
			.observeRouteBuilder((routeBuilder) => {
				this._modalRouteNewProperty = routeBuilder(null);
			});
	}

	async #addProperty(propertyData: UmbPropertyTypeModel) {
		const propertyPlaceholder = await this._propertyStructureHelper.addProperty(this._containerId);
		if (!propertyPlaceholder) return;

		this._propertyStructureHelper.partialUpdateProperty(propertyPlaceholder.id, propertyData);
	}

	render() {
		return html`
			<div id="property-list" ?sort-mode-active=${this._sortModeActive}>
				${repeat(
					this._propertyStructure,
					(property) => '' + property.container?.id + property.id + '' + property.sortOrder,
					(property) => {
						// Note: This piece might be moved into the property component
						const inheritedFromDocument = this._ownerDocumentTypes?.find(
							(types) => types.containers?.find((containers) => containers.id === property.container?.id),
						);

						return html`
							<umb-document-type-workspace-view-edit-property
								data-umb-property-id=${property.id}
								owner-document-type-id=${ifDefined(inheritedFromDocument?.unique)}
								owner-document-type-name=${ifDefined(inheritedFromDocument?.name)}
								?inherited=${property.container?.id !== this.containerId}
								?sort-mode-active=${this._sortModeActive}
								.property=${property}
								@partial-property-update=${(event: CustomEvent) => {
									this._propertyStructureHelper.partialUpdateProperty(property.id, event.detail);
								}}
								@property-delete=${() => {
									this._propertyStructureHelper.removeProperty(property.id!);
								}}>
							</umb-document-type-workspace-view-edit-property>
						`;
					},
				)}
			</div>

			${!this._sortModeActive
				? html`<uui-button
						label=${this.localize.term('contentTypeEditor_addProperty')}
						id="add"
						look="placeholder"
						href=${ifDefined(this._modalRouteNewProperty)}>
						<umb-localize key="contentTypeEditor_addProperty">Add property</umb-localize>
				  </uui-button> `
				: ''}
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#add {
				width: 100%;
			}

			#property-list[sort-mode-active]:not(:has(umb-document-type-workspace-view-edit-property)) {
				/* Some height so that the sorter can target the area if the group is empty*/
				min-height: var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbDocumentTypeWorkspaceViewEditPropertiesElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-type-workspace-view-edit-properties': UmbDocumentTypeWorkspaceViewEditPropertiesElement;
	}
}
