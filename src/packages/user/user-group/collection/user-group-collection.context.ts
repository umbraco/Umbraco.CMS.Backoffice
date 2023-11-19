import type { UmbUserGroupCollectionFilterModel } from '../types.js';
import { UMB_USER_GROUP_COLLECTION_REPOSITORY_ALIAS } from './repository/manifests.js';
import { UmbCollectionContext } from '@umbraco-cms/backoffice/collection';
import type { UserGroupResponseModel } from '@umbraco-cms/backoffice/backend-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class UmbUserGroupCollectionContext extends UmbCollectionContext<
	UserGroupResponseModel,
	UmbUserGroupCollectionFilterModel
> {
	constructor(host: UmbControllerHostElement) {
		super(host, 'user-group', UMB_USER_GROUP_COLLECTION_REPOSITORY_ALIAS);
	}
}
