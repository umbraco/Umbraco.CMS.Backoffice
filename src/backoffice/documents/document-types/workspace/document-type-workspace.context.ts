import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbEntityWorkspaceContextInterface } from '../../../shared/components/workspace/workspace-context/workspace-entity-context.interface';
import { UmbDocumentTypeRepository } from '../repository/document-type.repository';
import type { DocumentTypeResponseModel } from '@umbraco-cms/backend-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { ObjectState } from '@umbraco-cms/observable-api';

type EntityType = DocumentTypeResponseModel;
export class UmbWorkspaceDocumentTypeContext
	extends UmbWorkspaceContext<UmbDocumentTypeRepository>
	implements UmbEntityWorkspaceContextInterface<EntityType | undefined>
{
	#data = new ObjectState<EntityType | undefined>(undefined);
	data = this.#data.asObservable();
	name = this.#data.getObservablePart((data) => data?.name);

	constructor(host: UmbControllerHostInterface) {
		super(host, new UmbDocumentTypeRepository(host));
	}

	public setPropertyValue(alias: string, value: unknown) {
		throw new Error('setPropertyValue is not implemented for UmbWorkspaceDocumentTypeContext');
	}

	getData() {
		return this.#data.getValue();
	}

	getEntityKey() {
		return this.getData()?.key || '';
	}

	getEntityType() {
		return 'document-type';
	}

	setName(name: string) {
		this.#data.update({ name });
	}

	// TODO => manage setting icon color
	setIcon(icon: string) {
		this.#data.update({ icon });
	}

	async load(entityKey: string) {
		const { data } = await this.repository.requestByKey(entityKey);
		if (data) {
			this.#data.next(data);
		}
	}

	async createScaffold(parentKey: string | null) {
		const { data } = await this.repository.createScaffold(parentKey);
		if (!data) return;
		this.#data.next(data);
	}

	async save() {
		if (!this.#data.value) return;
		this.repository.save(this.#data.value);
	}

	public destroy(): void {
		this.#data.complete();
	}
}
