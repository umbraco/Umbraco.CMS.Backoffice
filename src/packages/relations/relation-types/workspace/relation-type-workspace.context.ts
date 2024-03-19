import { UmbRelationTypeRepository } from '../repository/relation-type.repository.js';
import {
	type UmbSaveableWorkspaceContextInterface,
	UmbEditableWorkspaceContextBase,
} from '@umbraco-cms/backoffice/workspace';
import type { RelationTypeBaseModel, RelationTypeResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export class UmbRelationTypeWorkspaceContext
	extends UmbEditableWorkspaceContextBase<RelationTypeResponseModel>
	implements UmbSaveableWorkspaceContextInterface
{
	//
	public readonly repository: UmbRelationTypeRepository = new UmbRelationTypeRepository(this);

	#parent?: { entityType: string; unique: string | null };

	#data = new UmbObjectState<RelationTypeResponseModel | undefined>(undefined);
	readonly data = this.#data.asObservable();
	readonly name = this.#data.asObservablePart((data) => data?.name);
	readonly id = this.#data.asObservablePart((data) => data?.id);

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.RelationType');
	}

	protected resetState(): void {
		super.resetState();
		this.#data.setValue(undefined);
	}

	async load(id: string) {
		this.resetState();
		const { data } = await this.repository.requestById(id);

		if (data) {
			this.setIsNew(false);
			this.#data.update(data);
		}
	}

	async create(parent: { entityType: string; unique: string | null }) {
		this.resetState();
		this.#parent = parent;
		const { data } = await this.repository.createScaffold();
		if (!data) return;
		this.setIsNew(true);
		this.#data.setValue(data);
	}

	async getRelations() {
		//TODO: How do we test this?
		return await this.repository.requestRelationsById(this.getUnique());
	}

	getData() {
		return this.#data.getValue();
	}

	getUnique() {
		return this.getData()?.id || '';
	}

	getEntityType() {
		return 'relation-type';
	}

	setName(name: string) {
		this.#data.update({ name });
	}

	async save() {
		if (!this.#data.value) return;
		if (!this.#data.value.id) return;

		let response = undefined;

		if (this.getIsNew()) {
			response = await this.repository.create(this.#data.value);
		} else {
			response = await this.repository.save(this.#data.value.id, this.#data.value);
		}

		if (response.error) return;

		// If it went well, then its not new anymore?.
		this.setIsNew(false);
	}

	update<K extends keyof RelationTypeBaseModel>(id: K, value: RelationTypeBaseModel[K]) {
		this.#data.update({ [id]: value });
	}

	async delete(id: string) {
		await this.repository.delete(id);
	}

	public destroy(): void {
		this.#data.destroy();
		super.destroy();
	}
}

export const UMB_RELATION_TYPE_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbRelationTypeWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbRelationTypeWorkspaceContext => context.getEntityType?.() === 'relation-type',
);
