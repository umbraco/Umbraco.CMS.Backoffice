import { UmbDocumentRepository } from '../repository/document.repository';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';

export class UmbCreateDocumentBlueprintEntityAction extends UmbEntityActionBase<UmbDocumentRepository> {
	constructor(host: UmbControllerHostInterface, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);
	}

	async execute() {
		console.log(`execute for: ${this.unique}`);
		await this.repository?.createBlueprint();
	}
}
