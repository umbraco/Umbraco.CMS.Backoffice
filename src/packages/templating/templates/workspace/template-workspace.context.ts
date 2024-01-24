import { UmbTemplateRepository } from '../repository/index.js';
import { UmbTemplateTreeRepository } from '../tree/index.js';
import { loadCodeEditor } from '@umbraco-cms/backoffice/code-editor';
import {
	UmbSaveableWorkspaceContextInterface,
	UmbEditableWorkspaceContextBase,
} from '@umbraco-cms/backoffice/workspace';
import { UmbBooleanState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { TemplateItemResponseModel, TemplateResponseModel } from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbId } from '@umbraco-cms/backoffice/id';

export class UmbTemplateWorkspaceContext
	extends UmbEditableWorkspaceContextBase<TemplateResponseModel>
	implements UmbSaveableWorkspaceContextInterface
{
	//
	public readonly repository: UmbTemplateRepository = new UmbTemplateRepository(this);

	#data = new UmbObjectState<TemplateResponseModel | undefined>(undefined);
	data = this.#data.asObservable();
	#masterTemplate = new UmbObjectState<TemplateItemResponseModel | null>(null);
	masterTemplate = this.#masterTemplate.asObservable();
	name = this.#data.asObservablePart((data) => data?.name);
	alias = this.#data.asObservablePart((data) => data?.alias);
	content = this.#data.asObservablePart((data) => data?.content);
	id = this.#data.asObservablePart((data) => data?.id);
	masterTemplateID = this.#data.asObservablePart((data) => data?.masterTemplateId);

	#isCodeEditorReady = new UmbBooleanState(false);
	isCodeEditorReady = this.#isCodeEditorReady.asObservable();

	// TODO: temp solution until we have automatic tree updates
	#treeRepository = new UmbTemplateTreeRepository(this);

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.Template');
		this.#loadCodeEditor();
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

	getEntityId() {
		return this.getData()?.id || '';
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

	async load(entityId: string) {
		const { data } = await this.repository.requestById(entityId);
		if (data) {
			this.setIsNew(false);
			this.setMasterTemplate(data.masterTemplateId ?? null);
			this.#data.setValue(data);
		}
	}

	async setMasterTemplate(id: string | null) {
		if (id === null) {
			this.#masterTemplate.setValue(null);
			this.#updateMasterTemplateLayoutBlock();
			return null;
		}

		const { data } = await this.repository.requestItems([id]);
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

	public async save() {
		const template = this.#data.getValue();
		const isNew = this.getIsNew();

		if (isNew && template) {
			const key = UmbId.new();
			this.#data.update({ id: key });
			await this.repository.create({
				key: key,
				name: template.name,
				content: template.content,
				alias: template.alias,
			});
			if (this.#masterTemplate.value?.id) {
				this.#treeRepository.requestTreeItemsOf(this.#masterTemplate.value?.id ?? '');
			} else {
				this.#treeRepository.requestRootTreeItems();
			}
			this.setIsNew(false);
			return;
		}

		if (template?.id) {
			await this.repository.save(template.id, {
				name: template.name,
				content: template.content,
				alias: template.alias,
			});
			this.#treeRepository.requestTreeItemsOf(this.#masterTemplate.value?.id ?? null);
		}
	}

	async create(parentId: string | null = null) {
		const { data } = await this.repository.createScaffold(parentId);
		if (!data) return;
		this.setIsNew(true);
		this.#data.setValue({ ...data, id: '', name: '', alias: '' });
		if (!parentId) return;
		await this.setMasterTemplate(parentId);
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
