import type { DictionaryDetails } from '@umbraco-cms/models';
import {
	UmbDictionaryDetailStoreItemType,
	UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN,
} from '../dictionary.detail.store';
import { UmbEntityWorkspaceManager } from 'src/backoffice/shared/components/workspace/workspace-context/entity-manager-controller';
import { UmbWorkspaceContext } from 'src/backoffice/shared/components/workspace/workspace-context/workspace-context';
import { UmbWorkspaceEntityContextInterface } from 'src/backoffice/shared/components/workspace/workspace-context/workspace-entity-context.interface';

export class UmbWorkspaceDictionaryContext
	extends UmbWorkspaceContext
	implements UmbWorkspaceEntityContextInterface<UmbDictionaryDetailStoreItemType | undefined>
{
	#manager = new UmbEntityWorkspaceManager(this._host, 'dictionary', UMB_DICTIONARY_DETAIL_STORE_CONTEXT_TOKEN);

	public readonly name = this.#manager.state.getObservablePart((state) => state?.name);
	public readonly data = this.#manager.state.asObservable();

	setName(name: string) {
		this.#manager.state.update({ name: name });
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

	public setPropertyValue(isoCode: string, translation: string) {
		const data = this.#manager.getData();
		const newDataSet = (data as DictionaryDetails).translations.map((dictionaryTranslation) => {
			if (dictionaryTranslation.isoCode === isoCode) {
				return { ...dictionaryTranslation, translation };
			}
			return dictionaryTranslation;
		});

		this.#manager.state.update({ translations: newDataSet } as Partial<UmbDictionaryDetailStoreItemType>);
	}
}
