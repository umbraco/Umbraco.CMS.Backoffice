import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import type { UmbDictionaryStore, UmbDictionaryStoreItemType } from '../dictionary.store';
import { STORE_ALIAS as DICTIONARY_STORE_ALIAS } from '../dictionary.store';
import { UmbControllerHostInterface } from 'src/core/controller/controller-host.mixin';
import type { DictionaryDetails } from '@umbraco-cms/models';

const DefaultDataTypeData = {
	key: '',
    name: '',
    type: 'dictionary',
    icon: 'umb:book-alt',
    hasChildren: false,
    isContainer: false,
    parentKey: null,
    translations: [],
} as UmbDictionaryStoreItemType;

export class UmbWorkspaceDictionaryContext extends UmbWorkspaceContentContext<UmbDictionaryStoreItemType, UmbDictionaryStore> {
	constructor(host: UmbControllerHostInterface) {
		super(host, DefaultDataTypeData, DICTIONARY_STORE_ALIAS, 'dictionary');
	}

    public setPropertyValue(isoCode: string, translation: string) {
		const data = this.getData();
		const newDataSet = (data as DictionaryDetails).translations.map((dictionaryTranslation) => {
			if (dictionaryTranslation.isoCode === isoCode) {
				return { ...dictionaryTranslation, translation };
			}
			return dictionaryTranslation;
		});

		this.update({ translations: newDataSet } as Partial<UmbDictionaryStoreItemType>);		
	}
}
