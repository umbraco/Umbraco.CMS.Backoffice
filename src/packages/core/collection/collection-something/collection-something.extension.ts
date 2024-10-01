import type { ConditionTypes } from '../../extension-registry/conditions/types.js';
import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestCollectionSomething
	extends ManifestElementAndApi,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'collectionSomething';
	meta: MetaCollectionSomething;
}

export interface MetaCollectionSomething {
	repositoryAlias: string;
}
