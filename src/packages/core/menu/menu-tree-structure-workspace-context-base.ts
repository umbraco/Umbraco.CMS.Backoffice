import type { UmbStructureItemModel } from './types.js';
import type { UmbTreeRepository, UmbUniqueTreeItemModel, UmbUniqueTreeRootModel } from '@umbraco-cms/backoffice/tree';
import { createExtensionApiByAlias } from '@umbraco-cms/backoffice/extension-registry';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

interface UmbMenuTreeStructureWorkspaceContextBaseArgs {
	treeRepositoryAlias: string;
}

export abstract class UmbMenuTreeStructureWorkspaceContextBase extends UmbContextBase<unknown> {
	#workspaceContext?: any;
	#args: UmbMenuTreeStructureWorkspaceContextBaseArgs;

	#structure = new UmbArrayState<UmbStructureItemModel>([], (x) => x.unique);
	public readonly structure = this.#structure.asObservable();

	constructor(host: UmbControllerHost, args: UmbMenuTreeStructureWorkspaceContextBaseArgs) {
		// TODO: set up context token
		super(host, 'UmbMenuStructureWorkspaceContext');
		this.#args = args;

		this.consumeContext(UMB_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.#workspaceContext.observe(this.#workspaceContext.unique, (value) => {
				if (!value) return;
				this.#requestStructure();
			});
		});
	}

	async #requestStructure() {
		let structureItems: Array<UmbStructureItemModel> = [];

		const treeRepository = await createExtensionApiByAlias<
			UmbTreeRepository<UmbUniqueTreeItemModel, UmbUniqueTreeRootModel>
		>(this, this.#args.treeRepositoryAlias);

		const { data: root } = await treeRepository.requestTreeRoot();

		if (root) {
			structureItems = [
				{
					unique: root.unique,
					entityType: root.entityType,
					name: root.name,
					isFolder: root.isFolder,
				},
			];
		}

		const isNew = this.#workspaceContext?.getIsNew();
		const uniqueObservable = isNew ? this.#workspaceContext?.parentUnique : this.#workspaceContext?.unique;

		const unique = (await this.observe(uniqueObservable, () => {})?.asPromise()) as string;
		if (!unique) throw new Error('Unique is not available');

		const { data } = await treeRepository.requestTreeItemAncestors({ descendantUnique: unique });

		if (data) {
			const ancestorItems = data.map((treeItem) => {
				return {
					unique: treeItem.unique,
					entityType: treeItem.entityType,
					name: treeItem.name,
					isFolder: treeItem.isFolder,
				};
			});
			structureItems.push(...ancestorItems);
		}

		this.#structure.setValue(structureItems);
	}
}
