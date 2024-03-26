import { UmbPartialViewDetailRepository } from '../repository/partial-view-detail.repository.js';
import type { UmbPartialViewDetailModel } from '../types.js';
import { UMB_PARTIAL_VIEW_ENTITY_TYPE } from '../entity.js';
import { UmbPartialViewWorkspaceEditorElement } from './partial-view-workspace-editor.element.js';
import { UmbBooleanState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbRoutableWorkspaceContext, UmbSaveableWorkspaceContext } from '@umbraco-cms/backoffice/workspace';
import {
	UmbSaveableWorkspaceContextBase,
	UmbWorkspaceIsNewRedirectController,
	UmbWorkspaceRouteManager,
} from '@umbraco-cms/backoffice/workspace';
import { loadCodeEditor } from '@umbraco-cms/backoffice/code-editor';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { PartialViewResource } from '@umbraco-cms/backoffice/external/backend-api';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbReloadTreeItemChildrenRequestEntityActionEvent } from '@umbraco-cms/backoffice/tree';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';
import type { IRoutingInfo, PageComponent } from '@umbraco-cms/backoffice/router';

export class UmbPartialViewWorkspaceContext
	extends UmbSaveableWorkspaceContextBase<UmbPartialViewDetailModel>
	implements UmbSaveableWorkspaceContext, UmbRoutableWorkspaceContext
{
	public readonly repository = new UmbPartialViewDetailRepository(this);

	#parent = new UmbObjectState<{ entityType: string; unique: string | null } | undefined>(undefined);
	readonly parentUnique = this.#parent.asObservablePart((parent) => (parent ? parent.unique : undefined));

	#data = new UmbObjectState<UmbPartialViewDetailModel | undefined>(undefined);
	readonly data = this.#data.asObservable();
	readonly unique = this.#data.asObservablePart((data) => data?.unique);
	readonly name = this.#data.asObservablePart((data) => data?.name);
	readonly content = this.#data.asObservablePart((data) => data?.content);
	readonly path = this.#data.asObservablePart((data) => data?.path);

	#isCodeEditorReady = new UmbBooleanState(false);
	readonly isCodeEditorReady = this.#isCodeEditorReady.asObservable();

	readonly routes = new UmbWorkspaceRouteManager(this);

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.PartialView');
		this.#loadCodeEditor();

		this.routes.setRoutes([
			{
				path: 'create/parent/:entityType/:parentUnique/snippet/:snippetId',
				component: UmbPartialViewWorkspaceEditorElement,
				setup: async (component: PageComponent, info: IRoutingInfo) => {
					const parentEntityType = info.match.params.entityType;
					const parentUnique = info.match.params.parentUnique === 'null' ? null : info.match.params.parentUnique;
					const snippetId = info.match.params.snippetId;
					this.#onCreate({ entityType: parentEntityType, unique: parentUnique }, snippetId);
				},
			},
			{
				path: 'create/parent/:entityType/:parentUnique',
				component: UmbPartialViewWorkspaceEditorElement,
				setup: async (component: PageComponent, info: IRoutingInfo) => {
					const parentEntityType = info.match.params.entityType;
					const parentUnique = info.match.params.parentUnique === 'null' ? null : info.match.params.parentUnique;
					this.#onCreate({ entityType: parentEntityType, unique: parentUnique });
				},
			},
			{
				path: 'edit/:unique',
				component: UmbPartialViewWorkspaceEditorElement,
				setup: (component: PageComponent, info: IRoutingInfo) => {
					const unique = info.match.params.unique;
					this.load(unique);
				},
			},
		]);
	}

	#onCreate = async (parent: { entityType: string; unique: string | null }, snippetId?: string) => {
		await this.create(parent, snippetId);

		new UmbWorkspaceIsNewRedirectController(
			this,
			this,
			this.getHostElement().shadowRoot!.querySelector('umb-router-slot')!,
		);
	};

	protected resetState(): void {
		super.resetState();
		this.#data.setValue(undefined);
	}

	async #loadCodeEditor() {
		try {
			await loadCodeEditor();
			this.#isCodeEditorReady.setValue(true);
		} catch (error) {
			console.error(error);
		}
	}

	getUnique() {
		const data = this.getData();
		if (!data) throw new Error('Data is missing');
		return data.unique;
	}

	getEntityType(): string {
		return UMB_PARTIAL_VIEW_ENTITY_TYPE;
	}

	getData() {
		return this.#data.getValue();
	}

	setName(value: string) {
		this.#data.update({ name: value });
	}

	setContent(value: string) {
		this.#data.update({ content: value });
	}

	async load(unique: string) {
		this.resetState();
		const { data } = await this.repository.requestByUnique(unique);
		if (data) {
			this.setIsNew(false);
			this.#data.setValue(data);
		}
	}

	async create(parent: { entityType: string; unique: string | null }, snippetId?: string) {
		this.resetState();
		this.#parent.setValue(parent);
		let snippetContent = '';

		if (snippetId) {
			const { data: snippet } = await this.#getSnippet(snippetId);
			snippetContent = snippet?.content || '';
		}

		const { data } = await this.repository.createScaffold({ content: snippetContent });

		if (data) {
			this.setIsNew(true);
			this.#data.setValue(data);
		}
	}

	public async save() {
		if (!this.#data.value) throw new Error('Data is missing');

		let newData = undefined;

		if (this.getIsNew()) {
			const parent = this.#parent.getValue();
			if (!parent) throw new Error('Parent is not set');
			const { data } = await this.repository.create(this.#data.value, parent.unique);

			// TODO: this might not be the right place to alert the tree, but it works for now
			const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbReloadTreeItemChildrenRequestEntityActionEvent({
				entityType: parent.entityType,
				unique: parent.unique,
			});

			eventContext.dispatchEvent(event);

			newData = data;
		} else {
			const { data } = await this.repository.save(this.#data.value);
			newData = data;

			const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbRequestReloadStructureForEntityEvent({
				unique: this.getUnique()!,
				entityType: this.getEntityType(),
			});

			actionEventContext.dispatchEvent(event);
		}

		if (newData) {
			this.#data.setValue(newData);
			this.setIsNew(false);
			this.workspaceComplete(newData);
		}
	}

	public destroy(): void {
		this.#data.destroy();
		super.destroy();
	}

	#getSnippet(snippetId: string) {
		return tryExecuteAndNotify(
			this,
			PartialViewResource.getPartialViewSnippetById({
				id: snippetId,
			}),
		);
	}
}

export { UmbPartialViewWorkspaceContext as api };
