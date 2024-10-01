import type { ManifestMenuItem, MetaMenuItem } from '@umbraco-cms/backoffice/menu';

export interface ManifestMenuItemCollectionKind extends ManifestMenuItem {
	type: 'menuItem';
	kind: 'collection';
	meta: MetaMenuItemCollectionKind;
}

export interface MetaMenuItemCollectionKind extends MetaMenuItem {
	collectionSomethingAlias: string;
	hideRoot?: boolean;
}

declare global {
	interface UmbExtensionManifestMap {
		umbCollectionMenuItemKind: ManifestMenuItemCollectionKind;
	}
}
