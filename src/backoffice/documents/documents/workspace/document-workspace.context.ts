import { UMB_DOCUMENT_DETAIL_STORE_CONTEXT_TOKEN } from '../document.detail.store';
import type { UmbWorkspaceEntityContextInterface } from '../../../shared/components/workspace/workspace-context/workspace-entity-context.interface';
import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbEntityWorkspaceManager } from '../../../shared/components/workspace/workspace-context/entity-manager-controller';
import type { DocumentDetails } from '@umbraco-cms/models';
import { appendToFrozenArray } from '@umbraco-cms/observable-api';

export class UmbDocumentWorkspaceContext extends UmbWorkspaceContext implements UmbWorkspaceEntityContextInterface<DocumentDetails | undefined> {

	// Repository notes:
	/*

	#draft = new ObjectState<Type | undefined>(undefined);


	*/

	// Manager will be removed when we get the Repository:
	#manager = new UmbEntityWorkspaceManager(this._host, 'document', UMB_DOCUMENT_DETAIL_STORE_CONTEXT_TOKEN);

	public readonly data = this.#manager.state.asObservable();
	public readonly name = this.#manager.state.getObservablePart((state) => state?.name);

	setName(name: string) {
		this.#manager.state.update({name: name})
	}
	getEntityType = this.#manager.getEntityType;
	getUnique = this.#manager.getEntityKey;
	getEntityKey = this.#manager.getEntityKey;
	getStore = this.#manager.getStore;
	getData = this.#manager.getData;
	load = this.#manager.load;
	create = this.#manager.create;
	save = this.#manager.save;
	destroy = this.#manager.destroy;

	/**
	 * Concept for Repository impl.:

	load(entityKey: string) {
		this.#repository.load(entityKey).then((data) => {
			this.#draft.next(data)
		})
	}

	create(parentKey: string | undefined) {
		this.#repository.create(parentKey).then((data) => {
			this.#draft.next(data)
		})
	}

	 */


	// This could eventually be moved out as well?
	setPropertyValue(alias: string, value: unknown) {

		const entry = {alias: alias, value: value};

		const currentData = this.#manager.getData();
		if (currentData) {
			const newDataSet = appendToFrozenArray(currentData.data, entry, x => x.alias);

			this.#manager.state.update({data: newDataSet});
		}
	}



	/*
	concept notes:

	public saveAndPublish() {

	}

	public saveAndPreview() {

	}
	*/

}
