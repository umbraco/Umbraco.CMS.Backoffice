import type { Observable } from 'rxjs';
import { UmbTreeRepository } from '@umbraco-cms/backoffice/repository';
import type { ManifestTree } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbDeepState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { createExtensionClass, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';

export interface UmbTreeContext {
	tree: ManifestTree;
	readonly selectable: Observable<boolean>;
	readonly selection: Observable<Array<string>>;
	setSelectable(value: boolean): void;
	setSelection(value: Array<string>): void;
	select(id: string): void;
}

export class UmbTreeContextBase implements UmbTreeContext {
	host: UmbControllerHostElement;
	public tree: ManifestTree;

	#selectable = new UmbDeepState(false);
	public readonly selectable = this.#selectable.asObservable();

	#selection = new UmbDeepState(<Array<string>>[]);
	public readonly selection = this.#selection.asObservable();

	repository?: UmbTreeRepository;

	#initResolver?: () => void;
	#initialized = false;

	#init = new Promise<void>((resolve) => {
		this.#initialized ? resolve() : (this.#initResolver = resolve);
	});

	constructor(host: UmbControllerHostElement, tree: ManifestTree) {
		this.host = host;
		this.tree = tree;

		const repositoryAlias = this.tree.meta.repositoryAlias;
		if (!repositoryAlias) throw new Error('Tree must have a repository alias.');

		new UmbObserverController(
			this.host,
			umbExtensionsRegistry.getByTypeAndAlias('repository', this.tree.meta.repositoryAlias),
			async (repositoryManifest) => {
				if (!repositoryManifest) return;

				try {
					const result = await createExtensionClass<UmbTreeRepository>(repositoryManifest, [this.host]);
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

	public setSelection(value: Array<string>) {
		if (!value) return;
		this.#selection.next(value);
	}

	public select(id: string) {
		const oldSelection = this.#selection.getValue();
		if (oldSelection.indexOf(id) !== -1) return;

		const selection = [...oldSelection, id];
		this.#selection.next(selection);
	}

	public deselect(id: string) {
		const selection = this.#selection.getValue();
		this.#selection.next(selection.filter((x) => x !== id));
	}

	public async requestRootItems() {
		await this.#init;
		return this.repository!.requestRootTreeItems();
	}

	public async requestChildrenOf(parentId: string | null) {
		await this.#init;
		return this.repository!.requestTreeItemsOf(parentId);
	}

	public async rootItems() {
		await this.#init;
		return this.repository!.rootTreeItems();
	}

	public async childrenOf(parentId: string | null) {
		await this.#init;
		return this.repository!.treeItemsOf(parentId);
	}
}
