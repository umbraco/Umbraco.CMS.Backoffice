import { UmbAction, UmbActionBase } from './action';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';

export interface UmbEntityBulkAction<RepositoryType = unknown> extends UmbAction<RepositoryType> {
	selection: Array<string>;
	setSelection(selection: Array<string>): void;
}

export class UmbEntityBulkActionBase<RepositoryType = unknown> extends UmbActionBase<RepositoryType> {
	selection: Array<string>;

	constructor(host: UmbControllerHostInterface, repositoryAlias: string, selection: Array<string>) {
		super(host, repositoryAlias);
		this.selection = selection;
	}

	setSelection(selection: Array<string>) {
		this.selection = selection;
	}
}
