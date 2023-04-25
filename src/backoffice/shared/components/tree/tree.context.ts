import type { Observable } from 'rxjs';
import { UmbPagedData, UmbTreeRepository } from '@umbraco-cms/backoffice/repository';
import type { ManifestTree } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbBooleanState, UmbArrayState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { createExtensionClass, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { ProblemDetailsModel, TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';

// TODO: update interface
export interface UmbTreeContext<TreeItemType extends TreeItemPresentationModel> {
	treeManifest: ManifestTree;
	readonly selectable: Observable<boolean>;
	readonly selection: Observable<Array<string | null>>;
	setSelectable(value: boolean): void;
	setMultiple(value: boolean): void;
	setSelection(value: Array<string | null>): void;
	select(unique: string | null): void;
	deselect(unique: string | null): void;
	requestChildrenOf: (parentUnique: string | null) => Promise<{
		data?: UmbPagedData<TreeItemType>;
		error?: ProblemDetailsModel;
		asObservable?: () => Observable<TreeItemType[]>;
	}>;
}

export class UmbTreeContextBase<TreeItemType extends TreeItemPresentationModel>
	implements UmbTreeContext<TreeItemType>
{
	public host: UmbControllerHostElement;
	public treeManifest: ManifestTree;

	#selectable = new UmbBooleanState(false);
	public readonly selectable = this.#selectable.asObservable();

	#multiple = new UmbBooleanState(false);
	public readonly multiple = this.#multiple.asObservable();

	#selection = new UmbArrayState(<Array<string | null>>[]);
	public readonly selection = this.#selection.asObservable();

	repository?: UmbTreeRepository<TreeItemType>;

	#initResolver?: () => void;
	#initialized = false;

	#init = new Promise<void>((resolve) => {
		this.#initialized ? resolve() : (this.#initResolver = resolve);
	});

	constructor(host: UmbControllerHostElement, tree: ManifestTree) {
		this.host = host;
		this.treeManifest = tree;

		const repositoryAlias = this.treeManifest.meta.repositoryAlias;
		if (!repositoryAlias) throw new Error('Tree must have a repository alias.');

		new UmbObserverController(
			this.host,
			umbExtensionsRegistry.getByTypeAndAlias('repository', this.treeManifest.meta.repositoryAlias),
			async (repositoryManifest) => {
				if (!repositoryManifest) return;

				try {
					const result = await createExtensionClass<UmbTreeRepository<TreeItemType>>(repositoryManifest, [this.host]);
					this.repository = result;
					this.#checkIfInitialized();
				} catch (error) {
					throw new Error('Could not create repository with alias: ' + repositoryAlias + '');
				}
			}
		);
	}

	// TODO: find a generic way to do this
	#checkIfInitialized() {
		if (this.repository) {
			this.#initialized = true;
			this.#initResolver?.();
		}
	}

	public setSelectable(value: boolean) {
		this.#selectable.next(value);
	}

	public getSelectable() {
		return this.#selectable.getValue();
	}

	public setMultiple(value: boolean) {
		this.#multiple.next(value);
	}

	public getMultiple() {
		return this.#multiple.getValue();
	}

	public setSelection(value: Array<string | null>) {
		if (!value) return;
		this.#selection.next(value);
	}

	public getSelection() {
		return this.#selection.getValue();
	}

	public select(unique: string | null) {
		if (!this.getSelectable()) return;
		const newSelection = this.getMultiple() ? [...this.getSelection(), unique] : [unique];
		this.#selection.next(newSelection);
	}

	public deselect(unique: string | null) {
		const newSelection = this.getSelection().filter((x) => x !== unique);
		this.#selection.next(newSelection);
	}

	public async requestTreeRoot() {
		await this.#init;
		return this.repository!.requestTreeRoot();
	}

	public async requestRootItems() {
		await this.#init;
		return this.repository!.requestRootTreeItems();
	}

	public async requestChildrenOf(parentUnique: string | null) {
		await this.#init;
		if (parentUnique === undefined) throw new Error('Parent unique cannot be undefined.');
		return this.repository!.requestTreeItemsOf(parentUnique);
	}

	public async rootItems() {
		await this.#init;
		return this.repository!.rootTreeItems();
	}

	public async childrenOf(parentUnique: string | null) {
		await this.#init;
		return this.repository!.treeItemsOf(parentUnique);
	}
}
