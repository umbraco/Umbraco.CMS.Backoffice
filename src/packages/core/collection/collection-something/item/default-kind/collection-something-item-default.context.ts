import type { UmbCollectionItemModel } from '../../../types.js';
import { UmbCollectionSomethingItemContextBase } from '../base/index.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbDefaultCollectionSomethingItemContext extends UmbCollectionSomethingItemContextBase<UmbCollectionItemModel> {
	constructor(host: UmbControllerHost) {
		super(host);
	}
}

export { UmbDefaultCollectionSomethingItemContext as api };
