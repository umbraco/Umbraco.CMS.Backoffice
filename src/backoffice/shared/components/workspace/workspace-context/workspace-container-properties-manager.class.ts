import { UmbDocumentWorkspaceContext } from '../../../../documents/documents/workspace/document-workspace.context';
import { PropertyContainerTypes } from './workspace-property-structure-manager.class';
import {
	DocumentTypePropertyTypeResponseModel,
	PropertyTypeContainerResponseModelBaseModel,
} from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController, UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/context-api';
import { ArrayState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

export class UmbWorkspaceContainerPropertiesManager {
	#host: UmbControllerHostElement;

	#workspaceContext?: UmbDocumentWorkspaceContext;

	private _containerName?: string;
	private _containerType?: PropertyContainerTypes;

	#propertyStructure = new ArrayState<DocumentTypePropertyTypeResponseModel>([], (x) => x.key);
	readonly propertyStructure = this.#propertyStructure.asObservable();

	constructor(host: UmbControllerHostElement) {
		this.#host = host;
		new UmbContextConsumerController(host, UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
			this.#workspaceContext = context as UmbDocumentWorkspaceContext;
			this._observeGroupContainers();
		});
	}

	public setContainerName(value?: string) {
		if (this._containerName === value) return;
		this._containerName = value;
		this._observeGroupContainers();
	}
	public getContainerName() {
		return this._containerName;
	}

	public setContainerType(value?: PropertyContainerTypes) {
		if (this._containerType === value) return;
		this._containerType = value;
		this._observeGroupContainers();
	}
	public getContainerType() {
		return this._containerType;
	}

	private _observeGroupContainers() {
		if (!this.#workspaceContext || !this._containerName || !this._containerType) return;

		new UmbObserverController(
			this.#host,
			this.#workspaceContext!.structure.containersByNameAndType(this._containerName, this._containerType),
			(groupContainers) => {
				groupContainers.forEach((group) => {
					if (group.key) {
						// Gather property aliases of this group, by group key.
						this._observePropertyStructureOfGroup(group);
					}
				});
			},
			'_observeGroupContainers'
		);
	}

	private _observePropertyStructureOfGroup(group: PropertyTypeContainerResponseModelBaseModel) {
		if (!this.#workspaceContext || !group.key) return;

		new UmbObserverController(
			this.#host,
			this.#workspaceContext.structure.propertyStructuresOf(group.key),
			(properties) => {
				// If this need to be able to remove properties, we need to clean out the ones of this group.key before inserting them:
				const _propertyStructure = this.#propertyStructure.getValue().filter((x) => x.containerKey !== group.key);

				properties?.forEach((property) => {
					if (!_propertyStructure.find((x) => x.alias === property.alias)) {
						_propertyStructure.push(property);
					}
				});

				if (_propertyStructure.length > 0) {
					// TODO: End-point: Missing sort order?
					//_propertyStructure = _propertyStructure.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
				}

				// Fire update to subscribers:
				this.#propertyStructure.next(_propertyStructure);
			},
			'_observePropertyStructureOfGroup' + group.key
		);
	}
}
