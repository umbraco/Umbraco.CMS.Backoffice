import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import type { DictionaryDetails } from '@umbraco-cms/models';
import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import { UmbDictionaryDetailStore, UmbDictionaryDetailStoreItemType, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN } from '../dictionary.detail.store';

const DefaultDataTypeData = {
	key: '',
    name: '',
    type: 'dictionary',
    icon: 'umb:book-alt',
    hasChildren: false,
    isContainer: false,
    parentKey: null,
    translations: [],
} as UmbDictionaryDetailStoreItemType;

export class UmbWorkspaceDictionaryContext extends UmbWorkspaceContentContext<UmbDictionaryDetailStoreItemType, UmbDictionaryDetailStore> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDataTypeData, UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN.toString(), 'dictionary');
	}

    public setPropertyValue(isoCode: string, translation: string) {
		const data = this.getData();
		const newDataSet = (data as DictionaryDetails).translations.map((dictionaryTranslation) => {
			if (dictionaryTranslation.isoCode === isoCode) {
				return { ...dictionaryTranslation, translation };
			}
			return dictionaryTranslation;
		});

		this.update({ translations: newDataSet } as Partial<UmbDictionaryDetailStoreItemType>);		
	}
}
