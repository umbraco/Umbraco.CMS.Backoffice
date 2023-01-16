import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import { STORE_ALIAS as DOCUMENT_STORE_ALIAS } from '../../../documents/documents/document.store';
import type { UmbDocumentStore, UmbDocumentStoreItemType } from '../../../documents/documents/document.store';
import type { UmbControllerHostInterface } from '@umbraco-cms/controller';
import type { DocumentDetails } from '@umbraco-cms/models';
import { appendToFrozenArray } from '@umbraco-cms/observable-api';

const DefaultDocumentData = {
	key: '',
	name: '',
	icon: '',
	type: '',
	hasChildren: false,
	parentKey: '',
	isTrashed: false,
	properties: [
		{
			alias: '',
			label: '',
			description: '',
			dataTypeKey: '',
		},
	],
	data: [
		{
			alias: '',
			value: '',
		},
	],
	variants: [
		{
			name: '',
		},
	],
} as UmbDocumentStoreItemType;

export class UmbWorkspaceDocumentContext extends UmbWorkspaceContentContext<UmbDocumentStoreItemType, UmbDocumentStore> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDocumentData, DOCUMENT_STORE_ALIAS, 'document');
	}

	public setPropertyValue(alias: string, value: unknown) {

		// TODO: make sure to check that we have a details model? otherwise fail? 8This can be relevant if we use the same context for tree actions?
		//if(isDocumentDetails(data)) { ... }
		const entry = {alias: alias, value: value};

		const newDataSet = appendToFrozenArray((this._data.getValue() as DocumentDetails).data, entry, x => x.alias === alias);

		this.update({data: newDataSet});
	}

	/*
	concept notes:

	public saveAndPublish() {

	}

	public saveAndPreview() {

	}
	*/

}
