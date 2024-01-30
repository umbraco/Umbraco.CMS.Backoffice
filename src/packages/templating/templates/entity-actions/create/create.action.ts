import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class UmbCreateEntityAction<T extends { copy(): Promise<void> }> extends UmbEntityActionBase<T> {
	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string, entityType: string) {
		super(host, repositoryAlias, unique, entityType);
	}

	// TODO: can we make this a generic create action
	async execute() {
		// TODO: get entity type from repository?
		const url = `section/settings/workspace/template/create/${this.unique || 'null'}`;
		// TODO: how do we handle this with a href?
		history.pushState(null, '', url);
	}
}
