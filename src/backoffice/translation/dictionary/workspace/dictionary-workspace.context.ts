import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import type { UmbDictionaryStore, UmbDictionaryStoreItemType } from '../dictionary.store';
import { UmbControllerHostInterface } from 'src/core/controller/controller-host.mixin';
import type { DictionaryDetails } from '@umbraco-cms/models';

const DefaultDataTypeData = {
	key: '',
    name: '',
    type: 'dictionary',
    icon: '',
    hasChildren: false,
    isContainer: false,
    parentKey: null,
    translations: [],
} as UmbDictionaryStoreItemType;

export class UmbWorkspaceDictionaryContext extends UmbWorkspaceContentContext<UmbDictionaryStoreItemType, UmbDictionaryStore> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDataTypeData, 'umbDictionaryStore', 'dictionary');
	}

    public setPropertyValue(isoCode: string, value: string) {
		const data = this._data.getValue();
		const property = (data as DictionaryDetails).translations.find((p) => p.isoCode === isoCode);
		if (!property) return;

		property.translation = value;
		this._data.next({ ...data });
	}
}
