import { UmbDocumentTypeRepository } from '../../../../documents/document-types/repository/document-type.repository';
import {
	DocumentTypeResponseModel,
	DocumentTypePropertyTypeResponseModel,
	PropertyTypeContainerResponseModelBaseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { ArrayState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

export type PropertyContainerTypes = 'Group' | 'Tab';

// TODO: get this type from the repository, or use some generic type.
type T = DocumentTypeResponseModel;

// TODO: make general interface for NodeTypeRepository, to replace UmbDocumentTypeRepository:
export class UmbWorkspacePropertyStructureManager<R extends UmbDocumentTypeRepository = UmbDocumentTypeRepository> {
	#host: UmbControllerHostElement;

	#documentTypeRepository: R;

	#documentTypes = new ArrayState<T>([], (x) => x.key);

	#containers = new ArrayState<PropertyTypeContainerResponseModelBaseModel>([], (x) => x.key);

	constructor(host: UmbControllerHostElement, typeRepository: R) {
		this.#host = host;
		this.#documentTypeRepository = typeRepository;
	}

	/**
	 * loadType will load the node type and all inherited and composed types.
	 * This will give us all the structure for properties and containers.
	 */
	public async loadType(key?: string) {
		this.#documentTypes.next([]);
		this.#containers.next([]);
		await this._loadType(key);
	}

	private async _loadType(key?: string) {
		if (!key) return;

		const { data } = await this.#documentTypeRepository.requestByKey(key);
		if (!data) return;

		// Load inherited and composed types:
		await data?.compositions?.forEach(async (composition) => {
			if (composition.key) {
				this.loadType(composition.key);
			}
		});

		new UmbObserverController(this.#host, await this.#documentTypeRepository.byKey(key), (docType) => {
			if (docType) {
				this.#documentTypes.appendOne(docType);
				this._initDocumentTypeContainers(docType);
				this._loadDocumentTypeCompositions(docType);
			}
		});
	}

	private async _loadDocumentTypeCompositions(documentType: T) {
		documentType.compositions?.forEach((composition) => {
			this._loadType(composition.key);
		});
	}

	private async _initDocumentTypeContainers(documentType: T) {
		documentType.containers?.forEach((container) => {
			this.#containers.appendOne(container);
		});
	}

	hasPropertyStructuresOf(containerKey: string | null) {
		return this.#documentTypes.getObservablePart((docTypes) => {
			return (
				docTypes.find((docType) => {
					return docType.properties?.find((property) => property.containerKey === containerKey);
				}) !== undefined
			);
		});
	}
	rootPropertyStructures() {
		return this.propertyStructuresOf(null);
	}
	propertyStructuresOf(containerKey: string | null) {
		return this.#documentTypes.getObservablePart((docTypes) => {
			const props: DocumentTypePropertyTypeResponseModel[] = [];
			docTypes.forEach((docType) => {
				docType.properties?.forEach((property) => {
					if (property.containerKey === containerKey) {
						props.push(property);
					}
				});
			});
			return props;
		});
	}

	rootContainers(containerType: PropertyContainerTypes) {
		return this.#containers.getObservablePart((data) => {
			return data.filter((x) => x.parentKey === null && x.type === containerType);
		});
	}

	hasRootContainers(containerType: PropertyContainerTypes) {
		return this.#containers.getObservablePart((data) => {
			return data.filter((x) => x.parentKey === null && x.type === containerType).length > 0;
		});
	}

	containersOfParentKey(
		parentKey: PropertyTypeContainerResponseModelBaseModel['parentKey'],
		containerType: PropertyContainerTypes
	) {
		return this.#containers.getObservablePart((data) => {
			return data.filter((x) => x.parentKey === parentKey && x.type === containerType);
		});
	}

	containersByNameAndType(name: string, containerType: PropertyContainerTypes) {
		return this.#containers.getObservablePart((data) => {
			return data.filter((x) => x.name === name && x.type === containerType);
		});
	}
}
