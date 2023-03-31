import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbDocumentTypeRepository } from '../repository/document-type.repository';
import { UmbWorkspacePropertyStructureManager } from '../../../shared/components/workspace/workspace-context/workspace-structure-manager.class';
import { UmbEntityWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';
import type { DocumentTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

type EntityType = DocumentTypeResponseModel;
export class UmbDocumentTypeWorkspaceContext
	extends UmbWorkspaceContext<UmbDocumentTypeRepository, EntityType>
	implements UmbEntityWorkspaceContextInterface<EntityType | undefined>
{
	// Draft is located in structure manager

	// General for content types:
	readonly data;
	readonly name;
	readonly alias;
	readonly description;
	readonly icon;

	// TODO: Consider if each of these should go the view it self, but only if its used in that one view, otherwise make then go here.
	readonly allowedAsRoot;
	readonly variesByCulture;
	readonly variesBySegment;
	readonly isElement;
	readonly allowedContentTypes;
	readonly compositions;

	// Document type specific:
	readonly allowedTemplateKeys;
	readonly defaultTemplateKey;
	readonly cleanup;

	readonly structure;

	constructor(host: UmbControllerHostElement) {
		super(host, new UmbDocumentTypeRepository(host));

		this.structure = new UmbWorkspacePropertyStructureManager(this.host, this.repository);

		// General for content types:
		this.data = this.structure.rootDocumentType;
		this.name = this.structure.rootDocumentTypeObservablePart((data) => data?.name);
		this.alias = this.structure.rootDocumentTypeObservablePart((data) => data?.alias);
		this.description = this.structure.rootDocumentTypeObservablePart((data) => data?.description);
		this.icon = this.structure.rootDocumentTypeObservablePart((data) => data?.icon);
		this.allowedAsRoot = this.structure.rootDocumentTypeObservablePart((data) => data?.allowedAsRoot);
		this.variesByCulture = this.structure.rootDocumentTypeObservablePart((data) => data?.variesByCulture);
		this.variesBySegment = this.structure.rootDocumentTypeObservablePart((data) => data?.variesBySegment);
		this.isElement = this.structure.rootDocumentTypeObservablePart((data) => data?.isElement);
		this.allowedContentTypes = this.structure.rootDocumentTypeObservablePart((data) => data?.allowedContentTypes);
		this.compositions = this.structure.rootDocumentTypeObservablePart((data) => data?.compositions);

		// Document type specific:
		this.allowedTemplateKeys = this.structure.rootDocumentTypeObservablePart((data) => data?.allowedTemplateKeys);
		this.defaultTemplateKey = this.structure.rootDocumentTypeObservablePart((data) => data?.defaultTemplateKey);
		this.cleanup = this.structure.rootDocumentTypeObservablePart((data) => data?.defaultTemplateKey);
	}

	public setPropertyValue(alias: string, value: unknown) {
		throw new Error('setPropertyValue is not implemented for UmbDocumentTypeWorkspaceContext');
	}

	getData() {
		return this.structure.getRootDocumentType() || {};
	}

	getEntityKey() {
		return this.getData().key;
	}

	getEntityType() {
		return 'document-type';
	}

	setName(name: string) {
		this.structure.updateRootDocumentType({ name });
	}
	setAlias(alias: string) {
		this.structure.updateRootDocumentType({ alias });
	}

	// TODO => manage setting icon color
	setIcon(icon: string) {
		this.structure.updateRootDocumentType({ icon });
	}

	async createScaffold(documentTypeKey: string) {
		const { data } = await this.structure.createScaffold(documentTypeKey);
		if (!data) return undefined;

		this.setIsNew(true);
		//this.#draft.next(data);
		return data || undefined;
	}

	async load(entityKey: string) {
		const { data } = await this.structure.loadType(entityKey);
		if (!data) return undefined;

		this.setIsNew(false);
		//this.#draft.next(data);
		return data || undefined;
	}

	async save() {
		this.repository.save(this.getData());
	}

	public destroy(): void {
		this.structure.destroy();
	}
}
