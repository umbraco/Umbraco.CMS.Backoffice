import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import type { ManifestElementAndApi } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestCollectionSomethingItem extends ManifestElementAndApi<UmbControllerHostElement, any> {
	type: 'collectionSomethingItem';
	forEntityTypes: Array<string>;
}

declare global {
	interface UmbExtensionManifestMap {
		umbCollectionSomethingItem: ManifestCollectionSomethingItem;
	}
}
