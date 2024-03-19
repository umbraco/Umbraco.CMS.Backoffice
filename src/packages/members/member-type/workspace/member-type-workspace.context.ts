import { UmbMemberTypeDetailRepository } from '../repository/detail/index.js';
import type { UmbMemberTypeDetailModel } from '../types.js';
import { UMB_MEMBER_TYPE_ENTITY_TYPE } from '../index.js';
import {
	type UmbSaveableWorkspaceContextInterface,
	UmbEditableWorkspaceContextBase,
} from '@umbraco-cms/backoffice/workspace';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import {
	type UmbContentTypeCompositionModel,
	UmbContentTypeStructureManager,
	type UmbContentTypeWorkspaceContext,
} from '@umbraco-cms/backoffice/content-type';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbReloadTreeItemChildrenRequestEntityActionEvent } from '@umbraco-cms/backoffice/tree';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';

type EntityType = UmbMemberTypeDetailModel;
export class UmbMemberTypeWorkspaceContext
	extends UmbEditableWorkspaceContextBase<EntityType>
	implements UmbContentTypeWorkspaceContext<EntityType>
{
	readonly IS_CONTENT_TYPE_WORKSPACE_CONTEXT = true;

	public readonly repository = new UmbMemberTypeDetailRepository(this);
	#parent?: { entityType: string; unique: string | null };
	#persistedData = new UmbObjectState<EntityType | undefined>(undefined);

	// General for content types:
	readonly data;
	readonly name;
	readonly alias;
	readonly description;
	readonly icon;

	readonly allowedAtRoot;
	readonly variesByCulture;
	readonly variesBySegment;
	readonly isElement;
	readonly allowedContentTypes;
	readonly compositions;

	readonly structure = new UmbContentTypeStructureManager<EntityType>(this, this.repository);

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.MemberType');

		// General for content types:
		this.data = this.structure.ownerContentType;
		this.name = this.structure.ownerContentTypeObservablePart((data) => data?.name);
		this.alias = this.structure.ownerContentTypeObservablePart((data) => data?.alias);
		this.description = this.structure.ownerContentTypeObservablePart((data) => data?.description);
		this.icon = this.structure.ownerContentTypeObservablePart((data) => data?.icon);
		this.allowedAtRoot = this.structure.ownerContentTypeObservablePart((data) => data?.allowedAtRoot);
		this.variesByCulture = this.structure.ownerContentTypeObservablePart((data) => data?.variesByCulture);
		this.variesBySegment = this.structure.ownerContentTypeObservablePart((data) => data?.variesBySegment);
		this.isElement = this.structure.ownerContentTypeObservablePart((data) => data?.isElement);
		this.allowedContentTypes = this.structure.ownerContentTypeObservablePart((data) => data?.allowedContentTypes);
		this.compositions = this.structure.ownerContentTypeObservablePart((data) => data?.compositions);
	}

	set<PropertyName extends keyof EntityType>(propertyName: PropertyName, value: EntityType[PropertyName]) {
		this.structure.updateOwnerContentType({ [propertyName]: value });
	}

	protected resetState(): void {
		super.resetState();
		this.#persistedData.setValue(undefined);
	}

	getData() {
		return this.structure.getOwnerContentType();
	}

	getUnique() {
		return this.getData()?.unique;
	}

	getEntityType() {
		return UMB_MEMBER_TYPE_ENTITY_TYPE;
	}

	setName(name: string) {
		this.structure.updateOwnerContentType({ name });
	}

	setAlias(alias: string) {
		this.structure.updateOwnerContentType({ alias });
	}

	setDescription(description: string) {
		this.structure.updateOwnerContentType({ description });
	}

	// TODO: manage setting icon color alias?
	setIcon(icon: string) {
		this.structure.updateOwnerContentType({ icon });
	}

	setCompositions(compositions: Array<UmbContentTypeCompositionModel>) {
		this.structure.updateOwnerContentType({ compositions });
	}

	async create(parent: { entityType: string; unique: string | null }) {
		this.resetState();
		this.#parent = parent;
		const { data } = await this.structure.createScaffold();
		if (!data) return undefined;

		this.setIsNew(true);
		this.#persistedData.setValue(data);
		return data;
	}

	async load(unique: string) {
		this.resetState();
		const { data, asObservable } = await this.structure.loadType(unique);

		if (data) {
			this.setIsNew(false);
			this.#persistedData.update(data);
		}

		if (asObservable) {
			this.observe(asObservable(), (entity) => this.#onStoreChange(entity), 'umbMemberTypeStoreObserver');
		}
	}

	#onStoreChange(entity: EntityType | undefined) {
		if (!entity) {
			//TODO: This solution is alright for now. But reconsider when we introduce signal-r
			history.pushState(null, '', 'section/settings/workspace/member-type-root');
		}
	}

	async save() {
		const data = this.getData();
		if (data === undefined) throw new Error('Cannot save, no data');

		if (this.getIsNew()) {
			if (!this.#parent) throw new Error('Parent is not set');
			await this.repository.create(data, this.#parent.unique);

			// TODO: this might not be the right place to alert the tree, but it works for now
			const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbReloadTreeItemChildrenRequestEntityActionEvent({
				entityType: this.#parent.entityType,
				unique: this.#parent.unique,
			});
			eventContext.dispatchEvent(event);
		} else {
			await this.structure.save();

			const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbRequestReloadStructureForEntityEvent({
				unique: this.getUnique()!,
				entityType: this.getEntityType(),
			});

			actionEventContext.dispatchEvent(event);
		}

		this.setIsNew(false);
		this.workspaceComplete(data);
	}

	public destroy(): void {
		this.#persistedData.destroy();
		this.structure.destroy();
		this.repository.destroy();
		super.destroy();
	}
}

export const UMB_MEMBER_TYPE_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbMemberTypeWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbMemberTypeWorkspaceContext => context.getEntityType?.() === 'member-type',
);
