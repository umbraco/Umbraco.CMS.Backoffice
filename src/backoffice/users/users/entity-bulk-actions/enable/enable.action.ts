import { UmbUserRepository } from '../../repository/user.repository';
import { UmbEntityBulkActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

export class UmbEnableUserEntityBulkAction extends UmbEntityBulkActionBase<UmbUserRepository> {
	constructor(host: UmbControllerHostElement, repositoryAlias: string, selection: Array<string>) {
		super(host, repositoryAlias, selection);
	}

	async execute() {
		//TODO: Implement
		alert('Bulk enable is not implemented yet');
	}
}
