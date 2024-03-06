import type { UmbTemplateDetailModel } from '../types.js';
import type { UmbTemplateItemModel } from '../repository/index.js';
import { UmbTemplateDetailRepository, UmbTemplateItemRepository } from '../repository/index.js';
import { UMB_TEMPLATE_WORKSPACE_ALIAS } from './manifests.js';
import { loadCodeEditor } from '@umbraco-cms/backoffice/code-editor';
import type { UmbSaveableWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';
import { UmbEditableWorkspaceContextBase } from '@umbraco-cms/backoffice/workspace';
import { UmbBooleanState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbReloadTreeItemChildrenRequestEntityActionEvent } from '@umbraco-cms/backoffice/tree';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';

export class UmbTemplateWorkspaceContext
	extends UmbEditableWorkspaceContextBase<UmbTemplateDetailModel>
	implements UmbSaveableWorkspaceContextInterface
{
	public readonly detailRepository = new UmbTemplateDetailRepository(this);
	public readonly itemRepository = new UmbTemplateItemRepository(this);

	#parent?: { entityType: string; unique: string | null };

	#data = new UmbObjectState<UmbTemplateDetailModel | undefined>(undefined);
	data = this.#data.asObservable();
	#masterTemplate = new UmbObjectState<UmbTemplateItemModel | null>(null);
	masterTemplate = this.#masterTemplate.asObservable();
	name = this.#data.asObservablePart((data) => data?.name);
	alias = this.#data.asObservablePart((data) => data?.alias);
	content = this.#data.asObservablePart((data) => data?.content);
	unique = this.#data.asObservablePart((data) => data?.unique);
	masterTemplateUnique = this.#data.asObservablePart((data) => data?.masterTemplate?.unique);

	#isCodeEditorReady = new UmbBooleanState(false);
	isCodeEditorReady = this.#isCodeEditorReady.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_TEMPLATE_WORKSPACE_ALIAS);
		this.#loadCodeEditor();
	}

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

	getEntityType(): string {
		return 'template';
	}

	getUnique() {
		return this.getData()?.unique;
	}

	getData() {
		return this.#data.getValue();
	}

	setName(value: string) {
		this.#data.update({ name: value });
	}

	setAlias(value: string) {
		this.#data.update({ alias: value });
	}

	setContent(value: string) {
		this.#data.update({ content: value });
	}

	getLayoutBlockRegexPattern() {
		return new RegExp('(@{[\\s\\S][^if]*?Layout\\s*?=\\s*?)("[^"]*?"|null)(;[\\s\\S]*?})', 'gi');
	}

	getHasLayoutBlock() {
		return this.getData()?.content ? this.getLayoutBlockRegexPattern().test(this.getData()?.content as string) : false;
	}

	async load(unique: string) {
		this.resetState();
		const { data } = await this.detailRepository.requestByUnique(unique);
		if (data) {
			this.setIsNew(false);
			this.setMasterTemplate(data.masterTemplate?.unique ?? null);
			this.#data.setValue(data);
		}
	}

	async setMasterTemplate(id: string | null) {
		if (id === null) {
			this.#masterTemplate.setValue(null);
			this.#updateMasterTemplateLayoutBlock();
			return null;
		}

		const { data } = await this.itemRepository.requestItems([id]);
		if (data) {
			this.#masterTemplate.setValue(data[0]);
			this.#updateMasterTemplateLayoutBlock();
			return data[0];
		}
		return null;
	}

	#updateMasterTemplateLayoutBlock = () => {
		const currentContent = this.#data.getValue()?.content;
		const newMasterTemplateAlias = this.#masterTemplate?.getValue()?.alias;
		const hasLayoutBlock = this.getHasLayoutBlock();

		if (this.#masterTemplate.getValue() === null && hasLayoutBlock && currentContent) {
			const newString = currentContent.replace(this.getLayoutBlockRegexPattern(), `$1null$3`);
			this.setContent(newString);
			return;
		}

		//if has layout block in the content
		if (hasLayoutBlock && currentContent) {
			const string = currentContent.replace(
				this.getLayoutBlockRegexPattern(),
				`$1"${newMasterTemplateAlias}.cshtml"$3`,
			);
			this.setContent(string);
			return;
		}

		//if no layout block in the content insert it at the beginning
		const string = `@{
	Layout = "${newMasterTemplateAlias}.cshtml";
}
${currentContent}`;
		this.setContent(string);
	};

	async create(parent: { entityType: string; unique: string | null }) {
		this.resetState();
		this.#parent = parent;
		const { data } = await this.detailRepository.createScaffold();
		if (!data) return;
		this.setIsNew(true);
		this.#data.setValue(data);

		if (!this.#parent) return;
		await this.setMasterTemplate(this.#parent.unique);
	}

	async save() {
		if (!this.#data.value) throw new Error('Data is missing');

		let newData = undefined;

		if (this.getIsNew()) {
			if (!this.#parent) throw new Error('Parent is not set');
			const { data } = await this.detailRepository.create(this.#data.value, this.#parent.unique);
			newData = data;

			// TODO: this might not be the right place to alert the tree, but it works for now
			const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbReloadTreeItemChildrenRequestEntityActionEvent({
				entityType: this.#parent.entityType,
				unique: this.#parent.unique,
			});
			eventContext.dispatchEvent(event);
		} else {
			const { data } = await this.detailRepository.save(this.#data.value);
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

	public destroy() {
		this.#data.destroy();
		super.destroy();
	}
}

export const UMB_TEMPLATE_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbTemplateWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbTemplateWorkspaceContext => context.getEntityType?.() === 'template',
);
