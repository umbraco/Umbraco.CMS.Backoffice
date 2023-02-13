import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbDocumentRepository } from '../repository/document.repository';
import type { UmbWorkspaceEntityContextInterface } from '../../../shared/components/workspace/workspace-context/workspace-entity-context.interface';
import type { DocumentDetails } from '@umbraco-cms/models';
import { appendToFrozenArray, ObjectState } from '@umbraco-cms/observable-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

// TODO: should this contex be called DocumentDraft instead of workspace? or should the draft be part of this?

type EntityType = DocumentDetails;
export class UmbDocumentWorkspaceContext
	extends UmbWorkspaceContext
	implements UmbWorkspaceEntityContextInterface<EntityType | undefined>
{
	#isNew = false;
	#host: UmbControllerHostInterface;
	#templateDetailRepo: UmbDocumentRepository;

	#data = new ObjectState<EntityType | undefined>(undefined);
	data = this.#data.asObservable();
	name = this.#data.getObservablePart((data) => data?.name);

	constructor(host: UmbControllerHostInterface) {
		super(host);
		this.#host = host;
		this.#templateDetailRepo = new UmbDocumentRepository(this.#host);
	}

	getData() {
		return this.#data.getValue();
	}

	/*
	getUnique() {
		return this.#data.getKey();
	}
	*/

	getEntityKey() {
		return this.getData()?.key || '';
	}

	getEntityType() {
		return 'document';
	}

	setName(name: string) {
		this.#data.update({ name });
	}
	/*
	getEntityType = this.#manager.getEntityType;
	getUnique = this.#manager.getEntityKey;
	getEntityKey = this.#manager.getEntityKey;

	*/

	/**
	 * Concept for Repository impl.:

	load(entityKey: string) {
		this.#repository.load(entityKey).then((data) => {
			this.#draft.next(data)
		})
	}

	create(parentKey: string | undefined) {
		this.#repository.create(parentKey).then((data) => {
			this.#draft.next(data)
		})
	}

	 */

	setPropertyValue(alias: string, value: unknown) {
		const entry = { alias: alias, value: value };

		const currentData = this.#data.value;
		if (currentData) {
			const newDataSet = appendToFrozenArray(currentData.data, entry, (x) => x.alias);

			this.#data.update({ data: newDataSet });
		}
	}

	async load(entityKey: string) {
		const { data } = await this.#templateDetailRepo.requestDetails(entityKey);
		if (data) {
			this.#isNew = false;
			this.#data.next(data);
		}
	}

	async createScaffold(parentKey: string | null) {
		const { data } = await this.#templateDetailRepo.createDetailsScaffold(parentKey);
		if (!data) return;
		this.#isNew = true;
		this.#data.next(data);
	}

	async save() {
		if (!this.#data.value) return;
		if (this.#isNew) {
			await this.#templateDetailRepo.createDetail(this.#data.value);
		} else {
			await this.#templateDetailRepo.saveDetail(this.#data.value);
		}
		// If it went well, then its not new anymore?.
		this.#isNew = false;
	}

	async delete(key: string) {
		await this.#templateDetailRepo.delete(key);
	}

	/*
	concept notes:

	public saveAndPublish() {

	}

	public saveAndPreview() {

	}
	*/

	public destroy(): void {
		this.#data.complete();
	}
}
