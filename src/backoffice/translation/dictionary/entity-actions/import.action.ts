import { UUITextStyles } from '@umbraco-ui/uui-css';
import { UmbEntityActionBase } from '../../../shared/entity-actions';
import { UmbDictionaryRepository } from '../repository/dictionary.repository';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

export default class UmbImportDictionaryEntityAction extends UmbEntityActionBase<UmbDictionaryRepository> {
	static styles = [UUITextStyles];

	constructor(host: UmbControllerHostInterface, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);
	}

	async execute() {
		alert('import');
		// Open modal
		// render current content from import-paged
	}
}