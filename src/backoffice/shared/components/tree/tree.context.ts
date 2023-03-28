import type { Observable } from 'rxjs';
import { UmbTreeRepository } from '@umbraco-cms/backoffice/repository';
import type { ManifestTree } from '@umbraco-cms/backoffice/extensions-registry';
import { DeepState } from '@umbraco-cms/backoffice/observable-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

export interface UmbTreeContext {
	tree: ManifestTree;
	readonly selectable: Observable<boolean>;
	readonly selection: Observable<Array<string>>;
	setSelectable(value: boolean): void;
	setSelection(value: Array<string>): void;
	select(key: string): void;
}

export class UmbTreeContextBase implements UmbTreeContext {
	#host: UmbControllerHostElement;
	public tree: ManifestTree;

	#selectable = new DeepState(false);
	public readonly selectable = this.#selectable.asObservable();

	#selection = new DeepState(<Array<string>>[]);
	public readonly selection = this.#selection.asObservable();

	repository!: UmbTreeRepository;

	constructor(host: UmbControllerHostElement, tree: ManifestTree) {
		this.#host = host;
		this.tree = tree;

		if (this.tree.meta.repository) {
			// TODO: should be using the right extension and the createExtensionClass method.
			this.repository = new this.tree.meta.repository(this.#host) as any;
		}
	}

	public setSelectable(value: boolean) {
		this.#selectable.next(value);
	}

	public setSelection(value: Array<string>) {
		if (!value) return;
		this.#selection.next(value);
	}

	public select(key: string) {
		const oldSelection = this.#selection.getValue();
		if (oldSelection.indexOf(key) !== -1) return;

		const selection = [...oldSelection, key];
		this.#selection.next(selection);
	}

	public deselect(key: string) {
		const selection = this.#selection.getValue();
		this.#selection.next(selection.filter((x) => x !== key));
	}

	public async requestRootItems() {
		return this.repository.requestRootTreeItems();
	}

	public async requestChildrenOf(parentKey: string | null) {
		return this.repository.requestTreeItemsOf(parentKey);
	}

	public async rootItems() {
		return this.repository.rootTreeItems();
	}

	public async childrenOf(parentKey: string | null) {
		return this.repository.treeItemsOf(parentKey);
	}
}
