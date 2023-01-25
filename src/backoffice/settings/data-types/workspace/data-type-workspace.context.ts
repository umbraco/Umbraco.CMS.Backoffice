import type { DataTypeDetails, DataTypePropertyData } from '@umbraco-cms/models';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { appendToFrozenArray } from '@umbraco-cms/observable-api';
import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import { UMB_DATA_TYPE_DETAIL_STORE_CONTEXT_TOKEN} from '../../../settings/data-types/data-type.detail.store';
import type {	UmbDataTypeDetailStore} from '../../../settings/data-types/data-type.detail.store';

const DefaultDataTypeData = {
	key: '',
	name: '',
	icon: '',
	type: 'data-type',
	hasChildren: false,
	parentKey: '',
	propertyEditorModelAlias: '',
	propertyEditorUIAlias: '',
	data: [],
} as DataTypeDetails;

export class UmbWorkspaceDataTypeContext extends UmbWorkspaceContentContext<
	DataTypeDetails,
	UmbDataTypeDetailStore
> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDataTypeData, UMB_DATA_TYPE_DETAIL_STORE_CONTEXT_TOKEN.toString(), 'dataType');
	}

	public setPropertyValue(alias: string, value: unknown) {
		// TODO: make sure to check that we have a details model? otherwise fail? 8This can be relevant if we use the same context for tree actions?
		const entry = { alias: alias, value: value };

		const newDataSet = appendToFrozenArray(
			(this._data.getValue() as DataTypeDetails).data,
			entry,
			(x: DataTypePropertyData) => x.alias
		);

		this.update({ data: newDataSet });
	}
}
