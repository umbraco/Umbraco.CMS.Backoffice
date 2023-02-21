import { BehaviorSubject } from 'rxjs';
import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbWorkspaceEntityContextInterface } from '../../../shared/components/workspace/workspace-context/workspace-entity-context.interface';
import { UmbDataTypeRepository } from '../repository/data-type.repository';
import type { DataTypeModel } from '@umbraco-cms/backend-api';
import { appendToFrozenArray, ObjectState } from '@umbraco-cms/observable-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

export class UmbDataTypeWorkspaceContext
	extends UmbWorkspaceContext
	implements UmbWorkspaceEntityContextInterface<DataTypeModel | undefined>
{
	#isNew = false;
	#host: UmbControllerHostInterface;
	#dataTypeRepository: UmbDataTypeRepository;

	#data = new ObjectState<DataTypeModel | undefined>(undefined);
	data = this.#data.asObservable();
	name = this.#data.getObservablePart((data) => data?.name);
	key = this.#data.getObservablePart((data) => data?.key);

	constructor(host: UmbControllerHostInterface) {
		super(host);
		this.#host = host;
		this.#dataTypeRepository = new UmbDataTypeRepository(this.#host);
	}

	async load(key: string) {
		const { data } = await this.#dataTypeRepository.requestByKey(key);
		if (data) {
			this.#isNew = false;
			this.#data.update(data);
		}
	}

	async createScaffold(parentKey: string | null) {
		const { data } = await this.#dataTypeRepository.createDetailsScaffold(parentKey);
		if (!data) return;
		this.#isNew = true;
		this.#data.next(data);
	}

	getData() {
		return this.#data.getValue();
	}
	getEntityKey() {
		return this.getData()?.key || '';
	}
	getEntityType() {
		return 'data-type';
	}

	setName(name: string) {
		this.#data.update({ name });
	}

	setPropertyEditorAlias(alias?: string) {
		this.#data.update({ propertyEditorAlias: alias });
	}
	setPropertyEditorUiAlias(alias?: string) {
		this.#data.update({ propertyEditorUiAlias: alias });
	}

	// TODO: its not called a property in the model, but we do consider this way in our front-end
	setPropertyValue(alias: string, value: unknown) {
		const entry = { alias: alias, value: value };

		const currentData = this.#data.value;
		if (currentData) {
			// TODO: make a partial update method for array of data, (idea/concept, use if this case is getting common)
			const newDataSet = appendToFrozenArray(currentData.data || [], entry, (x) => x.alias);
			this.#data.update({ data: newDataSet });
		}
	}

	async save() {
		if (!this.#data.value) return;
		if (this.#isNew) {
			await this.#dataTypeRepository.createDetail(this.#data.value);
		} else {
			await this.#dataTypeRepository.saveDetail(this.#data.value);
		}
		// If it went well, then its not new anymore?.
		this.#isNew = false;
	}

	async delete(key: string) {
		await this.#dataTypeRepository.delete(key);
	}

	public destroy(): void {
		this.#data.complete();
	}
}
