import { UmbTreeItemContextBase } from '../tree-item-base/tree-item-base.context';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { EntityTreeItemResponseModel } from '@umbraco-cms/backoffice/backend-api';

// TODO get unique method from an entity repository static method
export class UmbEntityTreeItemContext extends UmbTreeItemContextBase<EntityTreeItemResponseModel> {
	constructor(host: UmbControllerHostInterface) {
		super(host, (x: EntityTreeItemResponseModel) => x.key);
	}
}
