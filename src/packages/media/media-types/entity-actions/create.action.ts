import { UmbMediaTypeRepository } from '../repository/media-type.repository.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class UmbCreateMediaTypeEntityAction extends UmbEntityActionBase<UmbMediaTypeRepository> {
	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);
	}

	async execute() {
		console.log(`execute for: ${this.unique}`);
		alert('open create dialog');
	}
}
