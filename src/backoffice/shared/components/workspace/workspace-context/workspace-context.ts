import { UmbContextProviderController } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { DeepState } from '@umbraco-cms/backoffice/observable-api';

/*

TODO: We need to figure out if we like to keep using same alias for all workspace contexts.
If so we need to align on a interface that all of these implements. otherwise consumers cant trust the workspace-context.
*/
export abstract class UmbWorkspaceContext<T> {
	public host: UmbControllerHostElement;
	public repository: T;

	#isNew = new DeepState<boolean>(false);
	isNew = this.#isNew.asObservable();

	constructor(host: UmbControllerHostElement, repository: T) {
		this.host = host;
		this.repository = repository;
		new UmbContextProviderController(host, 'umbWorkspaceContext', this);
	}

	getIsNew() {
		return this.#isNew.getValue();
	}

	setIsNew(isNew: boolean) {
		this.#isNew.next(isNew);
	}
}
