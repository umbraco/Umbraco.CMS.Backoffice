import { UmbEntityActionBase } from '../../entity-action.js';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class UmbCopyEntityAction<T extends { copy(): Promise<void> }> extends UmbEntityActionBase<T> {
	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);
	}

	async execute() {
		console.log(`execute for: ${this.unique}`);
		await this.repository?.copy();
	}
}
