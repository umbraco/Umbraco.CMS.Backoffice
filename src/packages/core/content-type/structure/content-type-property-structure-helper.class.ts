import type {
	UmbContentTypeModel,
	UmbPropertyContainerTypes,
	UmbPropertyTypeContainerModel,
	UmbPropertyTypeModel,
} from '../types.js';
import type { UmbContentTypeStructureManager } from './content-type-structure-manager.class.js';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';

type UmbPropertyTypeId = UmbPropertyTypeModel['id'];

/**
 * This class is a helper class for managing the structure of containers in a content type.
 * This requires a structure manager {@link UmbContentTypeStructureManager} to manage the structure.
 */
export class UmbContentTypePropertyStructureHelper<T extends UmbContentTypeModel> extends UmbControllerBase {
	#init;
	#initResolver?: (value: unknown) => void;

	#structure?: UmbContentTypeStructureManager<T>;

	private _containerId?: string | null;

	#propertyStructure = new UmbArrayState<UmbPropertyTypeModel>([], (x) => x.id);
	readonly propertyStructure = this.#propertyStructure.asObservable();

	constructor(host: UmbControllerHost) {
		super(host);
		this.#init = new Promise((resolve) => {
			this.#initResolver = resolve;
		});
		this.#propertyStructure.sortBy((a, b) => a.sortOrder - b.sortOrder);
	}

	async contentTypes() {
		await this.#init;
		if (!this.#structure) return;
		return this.#structure.contentTypes;
	}

	public setStructureManager(structure: UmbContentTypeStructureManager<T>) {
		if (this.#structure === structure) return;
		if (this.#structure) {
			throw new Error(
				'Structure manager is already set, the helpers are not designed to be re-setup with new managers',
			);
		}
		this.#structure = structure;
		this.#initResolver?.(undefined);
		this.#initResolver = undefined;
		this.#observeContainers();
	}

	public getStructureManager() {
		return this.#structure;
	}

	public setContainerId(value?: string | null) {
		if (this._containerId === value) return;
		this._containerId = value;
		this.#observeContainers();
	}
	public getContainerId() {
		return this._containerId;
	}

	private _containerName?: string;
	private _containerType?: UmbPropertyContainerTypes;
	private _parentName?: string | null;
	private _parentType?: UmbPropertyContainerTypes;

	#containers?: Array<UmbPropertyTypeContainerModel>;
	#observeContainers() {
		if (!this.#structure || this._containerId === undefined) return;

		if (this._containerId === null) {
			this.#observePropertyStructureOf(null);
			this.removeControllerByAlias('_observeContainers');
		} else {
			this.observe(
				this.#structure.containerById(this._containerId),
				(container) => {
					if (container) {
						this._containerName = container.name ?? '';
						this._containerType = container.type;
						if (container.parent) {
							// We have a parent for our main container, so lets observe that one as well:
							this.observe(
								this.#structure!.containerById(container.parent.id),
								(parent) => {
									if (parent) {
										this._parentName = parent.name ?? '';
										this._parentType = parent.type;
										this.#observeSimilarContainers();
									} else {
										this.removeControllerByAlias('_observeContainers');
										this._parentName = undefined;
										this._parentType = undefined;
									}
								},
								'_observeMainParentContainer',
							);
						} else {
							this.removeControllerByAlias('_observeMainParentContainer');
							this._parentName = null; //In this way we want to look for one without a parent. [NL]
							this._parentType = undefined;
							this.#observeSimilarContainers();
						}
					} else {
						this.removeControllerByAlias('_observeContainers');
						this._containerName = undefined;
						this._containerType = undefined;
						this.#propertyStructure.setValue([]);
					}
				},
				'_observeMainContainer',
			);
		}
	}

	#observeSimilarContainers() {
		if (!this._containerName || !this._containerType || this._parentName === undefined) return;
		this.observe(
			this.#structure!.containersByNameAndTypeAndParent(
				this._containerName,
				this._containerType,
				this._parentName,
				this._parentType,
			),
			(groupContainers) => {
				if (this.#containers) {
					// We want to remove properties of groups that does not exist anymore: [NL]
					const goneGroupContainers = this.#containers.filter((x) => !groupContainers.some((y) => y.id === x.id));
					const _propertyStructure = this.#propertyStructure
						.getValue()
						.filter((x) => !goneGroupContainers.some((y) => y.id === x.container?.id));
					this.#propertyStructure.setValue(_propertyStructure);
				}

				groupContainers.forEach((group) => this.#observePropertyStructureOf(group.id));
				this.#containers = groupContainers;
			},
			'_observeContainers',
		);
	}

	#observePropertyStructureOf(groupId?: string | null) {
		if (!this.#structure || groupId === undefined) return;

		this.observe(
			this.#structure.propertyStructuresOf(groupId),
			(properties) => {
				// Lets remove the properties that does not exists any longer:
				const _propertyStructure = this.#propertyStructure
					.getValue()
					.filter((x) => !(x.container?.id === groupId && !properties.some((y) => y.id === x.id)));

				// Lets append the properties that does not exists already:
				properties?.forEach((property) => {
					if (!_propertyStructure.find((x) => x.alias === property.alias)) {
						_propertyStructure.push(property);
					}
				});

				// Fire update to subscribers:
				this.#propertyStructure.setValue(_propertyStructure);
			},
			'_observePropertyStructureOfGroup' + groupId,
		);
	}

	async isOwnerProperty(propertyId: UmbPropertyTypeId) {
		await this.#init;
		if (!this.#structure) return;

		return this.#structure.ownerContentTypePart((x) => x?.properties.some((y) => y.id === propertyId));
	}

	// TODO: consider moving this to another class, to separate 'viewer' from 'manipulator':
	/** Manipulate methods: */

	async createPropertyScaffold(ownerId?: string) {
		await this.#init;
		if (!this.#structure) return;

		return await this.#structure.createPropertyScaffold(ownerId);
	}
	/*
		Only used by legacy implementation:
		@deprecated
	*/
	async addProperty(containerId?: string, sortOrder?: number) {
		await this.#init;
		if (!this.#structure) return;

		return await this.#structure.createProperty(null, containerId, sortOrder);
	}

	async insertProperty(property: UmbPropertyTypeModel, sortOrder?: number) {
		await this.#init;
		if (!this.#structure) return false;

		const newProperty = { ...property };
		if (sortOrder) {
			newProperty.sortOrder = sortOrder;
		}

		await this.#structure.insertProperty(null, newProperty);
		return true;
	}

	async removeProperty(propertyId: UmbPropertyTypeId) {
		await this.#init;
		if (!this.#structure) return false;

		await this.#structure.removeProperty(null, propertyId);
		return true;
	}

	// Takes optional arguments as this is easier for the implementation in the view:
	async partialUpdateProperty(propertyKey?: string, partialUpdate?: Partial<UmbPropertyTypeModel>) {
		await this.#init;
		if (!this.#structure || !propertyKey || !partialUpdate) return;
		return await this.#structure.updateProperty(null, propertyKey, partialUpdate);
	}
}
