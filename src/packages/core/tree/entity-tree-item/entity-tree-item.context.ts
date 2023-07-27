import { UmbTreeItemContextBase } from '../tree-item-base/tree-item-base.context.js';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { EntityTreeItemResponseModel } from '@umbraco-cms/backoffice/backend-api';

// TODO get unique method from an entity repository static method
export class UmbEntityTreeItemContext extends UmbTreeItemContextBase<EntityTreeItemResponseModel> {
	constructor(host: UmbControllerHostElement) {
		super(host, (x: EntityTreeItemResponseModel) => x.id);
	}
}
