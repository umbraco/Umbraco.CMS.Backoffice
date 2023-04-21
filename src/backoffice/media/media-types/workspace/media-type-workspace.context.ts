import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbMediaTypeRepository } from '../repository/media-type.repository';
import { UmbEntityWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { MediaTypeDetails } from '@umbraco-cms/backoffice/models';

type EntityType = MediaTypeDetails;
export class UmbWorkspaceMediaTypeContext
	extends UmbWorkspaceContext<UmbMediaTypeRepository, EntityType>
	implements UmbEntityWorkspaceContextInterface<EntityType | undefined>
{
	#data = new UmbObjectState<MediaTypeDetails | undefined>(undefined);
	data = this.#data.asObservable();
	name = this.#data.getObservablePart((data) => data?.name);

	constructor(host: UmbControllerHostElement) {
		super(host, new UmbMediaTypeRepository(host));
	}

	getData() {
		return this.#data.getValue();
	}

	getEntityId() {
		return this.getData()?.id || '';
	}

	getEntityType() {
		return 'media-type';
	}

	setName(name: string) {
		this.#data.update({ name });
	}

	setPropertyValue(alias: string, value: string) {
		// TODO => Implement setPropertyValue
	}

	async load(entityId: string) {
		const { data } = await this.repository.requestDetails(entityId);
		if (data) {
			this.#data.next(data);
		}
	}

	async createScaffold() {
		const { data } = await this.repository.createScaffold();
		if (!data) return;
		this.setIsNew(true);
		this.#data.next(data);
	}

	async save() {
		if (!this.#data.value) return;
		await this.repository.save(this.#data.value);
		this.setIsNew(false);
	}

	public destroy(): void {
		this.#data.complete();
	}
}
