import { UmbDetailRepository } from '@umbraco-cms/backoffice/repository';
import { UmbId } from '@umbraco-cms/backoffice/id';
import {
	DocumentTypePropertyTypeResponseModel,
	PropertyTypeContainerModelBaseModel,
	PropertyTypeModelBaseModel,
	DocumentTypeResponseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement, UmbController } from '@umbraco-cms/backoffice/controller-api';
import {
	UmbArrayState,
	UmbObserverController,
	MappingFunction,
	partialUpdateFrozenArray,
	appendToFrozenArray,
	filterFrozenArray,
} from '@umbraco-cms/backoffice/observable-api';
import { incrementString } from '@umbraco-cms/backoffice/utils';

export type PropertyContainerTypes = 'Group' | 'Tab';

type T = DocumentTypeResponseModel;

// TODO: get this type from the repository, or use some generic type.
export class UmbContentTypePropertyStructureManager<R extends UmbDetailRepository<T> = UmbDetailRepository<T>> {
	#host: UmbControllerHostElement;
	#init!: Promise<unknown>;

	#contentTypeRepository: R;

	#ownerDocumentTypeId?: string;
	#documentTypeObservers = new Array<UmbController>();
	#documentTypes = new UmbArrayState<T>([], (x) => x.id);
	readonly documentTypes = this.#documentTypes.asObservable();
	private readonly _documentTypeContainers = this.#documentTypes.asObservablePart((x) =>
		x.flatMap((x) => x.containers ?? [])
	);

	#containers: UmbArrayState<PropertyTypeContainerModelBaseModel> =
		new UmbArrayState<PropertyTypeContainerModelBaseModel>([], (x) => x.id);

	constructor(host: UmbControllerHostElement, typeRepository: R) {
		this.#host = host;
		this.#contentTypeRepository = typeRepository;

		new UmbObserverController(host, this.documentTypes, (documentTypes) => {
			documentTypes.forEach((documentType) => {
				this._loadDocumentTypeCompositions(documentType);
			});
		});
		new UmbObserverController(host, this._documentTypeContainers, (documentTypeContainers) => {
			this.#containers.next(documentTypeContainers);
		});
	}

	/**
	 * loadType will load the node type and all inherited and composed types.
	 * This will give us all the structure for properties and containers.
	 */
	public async loadType(id?: string) {
		this._reset();

		this.#ownerDocumentTypeId = id;

		const promiseResult = this._loadType(id);
		this.#init = promiseResult;
		await this.#init;
		return promiseResult;
	}

	public async createScaffold(parentId: string | null) {
		this._reset();

		if (parentId === undefined) return {};

		const { data } = await this.#contentTypeRepository.createScaffold(parentId);
		if (!data) return {};

		this.#ownerDocumentTypeId = data.id;

		this.#init = this._observeDocumentType(data);
		await this.#init;
		return { data };
	}

	public async save() {
		const documentType = this.getOwnerDocumentType();
		if (!documentType || !documentType.id) return false;

		await this.#contentTypeRepository.save(documentType.id, documentType);

		return true;
	}

	public async create() {
		const documentType = this.getOwnerDocumentType();
		if (!documentType || !documentType.id) return false;

		//const value = documentType as CreateDocumentTypeRequestModel & { id: string };
		const { data } = await this.#contentTypeRepository.create(documentType);

		if (!data) return false;

		await this.loadType(data.id);

		return true;
	}

	private async _ensureType(id?: string) {
		if (!id) return;
		if (this.#documentTypes.getValue().find((x) => x.id === id)) return;
		await this._loadType(id);
	}

	private async _loadType(id?: string) {
		if (!id) return {};

		const { data } = await this.#contentTypeRepository.requestById(id);
		if (!data) return {};

		await this._observeDocumentType(data);
		return { data };
	}

	public async _observeDocumentType(data: T) {
		if (!data.id) return;

		// Load inherited and composed types:
		this._loadDocumentTypeCompositions(data);

		this.#documentTypeObservers.push(
			new UmbObserverController(this.#host, await this.#contentTypeRepository.byId(data.id), (docType) => {
				if (docType) {
					// TODO: Handle if there was changes made to the owner document type in this context.
					/*
					possible easy solutions could be to notify user wether they want to update(Discard the changes to accept the new ones).
					 */
					this.#documentTypes.appendOne(docType);
				}
			})
		);
	}

	private async _loadDocumentTypeCompositions(documentType: T) {
		documentType.compositions?.forEach((composition) => {
			this._ensureType(composition.id);
		});
	}

	/*
	private async _initDocumentTypeContainers(documentType: T) {
		documentType.containers?.forEach((container) => {
			this.#containers.appendOne({ ...container, _ownerDocumentTypeKey: documentType.id });
		});
	}
	*/

	/** Public methods for consuming structure: */

	ownerDocumentType() {
		return this.#documentTypes.asObservablePart((x) => x.find((y) => y.id === this.#ownerDocumentTypeId));
	}
	getOwnerDocumentType() {
		return this.#documentTypes.getValue().find((y) => y.id === this.#ownerDocumentTypeId);
	}
	updateOwnerDocumentType(entry: T) {
		this.#documentTypes.updateOne(this.#ownerDocumentTypeId, entry);
	}

	// We could move the actions to another class?

	async createContainer(
		contentTypeId: string | null,
		parentId: string | null = null,
		type: PropertyContainerTypes = 'Group',
		sortOrder?: number
	) {
		await this.#init;
		contentTypeId = contentTypeId ?? this.#ownerDocumentTypeId!;

		const container: PropertyTypeContainerModelBaseModel = {
			id: UmbId.new(),
			parentId: parentId ?? null,
			name: '',
			type: type,
			sortOrder: sortOrder ?? 0,
		};

		const containers = [...(this.#documentTypes.getValue().find((x) => x.id === contentTypeId)?.containers ?? [])];
		containers.push(container);

		this.#documentTypes.updateOne(contentTypeId, { containers });

		return container;
	}

	makeContainerNameUniqueForOwnerDocument(
		newName: string,
		containerType: PropertyContainerTypes = 'Tab',
		parentId: string | null = null
	) {
		const ownerRootContainers = this.getOwnerContainers(containerType); //getRootContainers() can't differentiates between compositions and locals

		let changedName = newName;
		if (ownerRootContainers) {
			while (ownerRootContainers.find((tab) => tab.name === changedName && tab.id !== parentId)) {
				changedName = incrementString(changedName);
			}

			return changedName === newName ? null : changedName;
		}
		return null;
	}

	async updateContainer(
		documentTypeId: string | null,
		containerId: string,
		partialUpdate: Partial<PropertyTypeContainerModelBaseModel>
	) {
		await this.#init;
		documentTypeId = documentTypeId ?? this.#ownerDocumentTypeId!;

		const frozenContainers = this.#documentTypes.getValue().find((x) => x.id === documentTypeId)?.containers ?? [];

		const containers = partialUpdateFrozenArray(frozenContainers, partialUpdate, (x) => x.id === containerId);

		this.#documentTypes.updateOne(documentTypeId, { containers });
	}

	async removeContainer(documentTypeKey: string | null, containerId: string | null = null) {
		await this.#init;
		documentTypeKey = documentTypeKey ?? this.#ownerDocumentTypeId!;

		const frozenContainers = this.#documentTypes.getValue().find((x) => x.id === documentTypeKey)?.containers ?? [];
		const containers = frozenContainers.filter((x) => x.id !== containerId);

		this.#documentTypes.updateOne(documentTypeKey, { containers });
	}

	async createProperty(documentTypeId: string | null, containerId: string | null = null, sortOrder?: number) {
		await this.#init;
		documentTypeId = documentTypeId ?? this.#ownerDocumentTypeId!;

		const property: PropertyTypeModelBaseModel = {
			id: UmbId.new(),
			containerId: containerId,
			alias: '',
			name: '',
			description: '',
			dataTypeId: '',
			variesByCulture: false,
			variesBySegment: false,
			validation: {
				mandatory: false,
				mandatoryMessage: null,
				regEx: null,
				regExMessage: null,
			},
			appearance: {
				labelOnTop: false,
			},
			sortOrder: sortOrder ?? 0,
		} as any; // Sort order was not allowed when this was written.

		const properties = [...(this.#documentTypes.getValue().find((x) => x.id === documentTypeId)?.properties ?? [])];
		properties.push(property);

		this.#documentTypes.updateOne(documentTypeId, { properties });

		return property;
	}

	async insertProperty(documentTypeId: string | null, property: PropertyTypeModelBaseModel) {
		await this.#init;
		documentTypeId = documentTypeId ?? this.#ownerDocumentTypeId!;

		const frozenProperties = this.#documentTypes.getValue().find((x) => x.id === documentTypeId)?.properties ?? [];

		const properties = appendToFrozenArray(frozenProperties, property, (x) => x.id === property.id);

		this.#documentTypes.updateOne(documentTypeId, { properties });
	}

	async removeProperty(documentTypeId: string | null, propertyId: string) {
		await this.#init;
		documentTypeId = documentTypeId ?? this.#ownerDocumentTypeId!;

		const frozenProperties = this.#documentTypes.getValue().find((x) => x.id === documentTypeId)?.properties ?? [];

		const properties = filterFrozenArray(frozenProperties, (x) => x.id === propertyId);

		this.#documentTypes.updateOne(documentTypeId, { properties });
	}

	async updateProperty(
		documentTypeId: string | null,
		propertyId: string,
		partialUpdate: Partial<PropertyTypeModelBaseModel>
	) {
		await this.#init;
		documentTypeId = documentTypeId ?? this.#ownerDocumentTypeId!;

		const frozenProperties = this.#documentTypes.getValue().find((x) => x.id === documentTypeId)?.properties ?? [];

		const properties = partialUpdateFrozenArray(frozenProperties, partialUpdate, (x) => x.id === propertyId);

		this.#documentTypes.updateOne(documentTypeId, { properties });
	}

	/*
	rootDocumentTypeName() {
		return this.#documentTypes.asObservablePart((docTypes) => {
			const docType = docTypes.find((x) => x.id === this.#rootDocumentTypeKey);
			return docType?.name ?? '';
		});
	}
	*/

	ownerDocumentTypeObservablePart<PartResult>(mappingFunction: MappingFunction<T, PartResult>) {
		return this.#documentTypes.asObservablePart((docTypes) => {
			const docType = docTypes.find((x) => x.id === this.#ownerDocumentTypeId);
			return docType ? mappingFunction(docType) : undefined;
		});
	}
	/*
	nameOfDocumentType(id: string) {
		return this.#documentTypes.asObservablePart((docTypes) => {
			const docType = docTypes.find((x) => x.id === id);
			return docType?.name ?? '';
		});
	}
	*/

	hasPropertyStructuresOf(containerId: string | null) {
		return this.#documentTypes.asObservablePart((docTypes) => {
			return (
				docTypes.find((docType) => {
					return docType.properties?.find((property) => property.containerId === containerId);
				}) !== undefined
			);
		});
	}
	rootPropertyStructures() {
		return this.propertyStructuresOf(null);
	}
	propertyStructuresOf(containerId: string | null) {
		return this.#documentTypes.asObservablePart((docTypes) => {
			const props: DocumentTypePropertyTypeResponseModel[] = [];
			docTypes.forEach((docType) => {
				docType.properties?.forEach((property) => {
					if (property.containerId === containerId) {
						props.push(property);
					}
				});
			});
			return props;
		});
	}

	rootContainers(containerType: PropertyContainerTypes) {
		return this.#containers.asObservablePart((data) => {
			return data.filter((x) => x.parentId === null && x.type === containerType);
		});
	}

	getRootContainers(containerType: PropertyContainerTypes) {
		return this.#containers.getValue().filter((x) => x.parentId === null && x.type === containerType);
	}

	hasRootContainers(containerType: PropertyContainerTypes) {
		return this.#containers.asObservablePart((data) => {
			return data.filter((x) => x.parentId === null && x.type === containerType).length > 0;
		});
	}

	ownerContainersOf(containerType: PropertyContainerTypes) {
		return this.ownerDocumentTypeObservablePart((x) => x.containers?.filter((x) => x.type === containerType) ?? []);
	}

	getOwnerContainers(containerType: PropertyContainerTypes, parentId: string | null = null) {
		return this.getOwnerDocumentType()?.containers?.filter((x) => x.parentId === parentId && x.type === containerType);
	}

	isOwnerContainer(containerId: string) {
		return this.getOwnerDocumentType()?.containers?.filter((x) => x.id === containerId);
	}

	containersOfParentKey(
		parentId: PropertyTypeContainerModelBaseModel['parentId'],
		containerType: PropertyContainerTypes
	) {
		return this.#containers.asObservablePart((data) => {
			return data.filter((x) => x.parentId === parentId && x.type === containerType);
		});
	}

	// In future this might need to take parentName(parentId lookup) into account as well? otherwise containers that share same name and type will always be merged, but their position might be different and they should not be merged.
	containersByNameAndType(name: string, containerType: PropertyContainerTypes) {
		return this.#containers.asObservablePart((data) => {
			return data.filter((x) => x.name === name && x.type === containerType);
		});
	}

	private _reset() {
		this.#documentTypeObservers.forEach((observer) => observer.destroy());
		this.#documentTypeObservers = [];
		this.#documentTypes.next([]);
		this.#containers.next([]);
	}
	public destroy() {
		this._reset();
		this.#documentTypes.complete();
		this.#containers.complete();
	}
}
