import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';
import type { ConditionTypes } from '@umbraco-cms/backoffice/extension-registry';

export interface ManifestCollectionSomething
	extends ManifestElementAndApi,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'collectionSomething';
	meta: MetaCollectionSomething;
}

export interface MetaCollectionSomething {
	repositoryAlias: string;
}

declare global {
	interface UmbExtensionManifestMap {
		umbCollectionSomething: ManifestCollectionSomething;
	}
}
