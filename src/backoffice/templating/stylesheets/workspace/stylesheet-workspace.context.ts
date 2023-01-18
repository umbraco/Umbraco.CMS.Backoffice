import { UmbWorkspaceContentContext } from '../../../shared/components/workspace/workspace-content/workspace-content.context';
import { UmbStylesheetDetailsStoreItem, UmbStylesheetStore, UmbStylesheetStoreItem } from '../stylesheets.store';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

const StylesheetDefaultData: UmbStylesheetDetailsStoreItem = {
	unique: '',
	parentUnique: '',
	path: '',
	isFolder: false,
	name: '',
	type: 'stylesheet',
	icon: 'umb:brackets',
	hasChildren: false,
	content: '',
};

// TODO: do not extend content context - or rename it to something more generic
export class UmbStylesheetWorkspaceContext extends UmbWorkspaceContentContext<
	UmbStylesheetStoreItem,
	UmbStylesheetStore
> {
	constructor(host: UmbControllerHostInterface) {
		super(host, StylesheetDefaultData, 'umbStylesheetStore', 'stylesheet');
	}
}
