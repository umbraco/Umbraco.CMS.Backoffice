export interface ManifestMenuItemCollectionKind extends ManifestMenuItem {
	type: 'menuItem';
	kind: 'collection';
	meta: MetaMenuItemCollectionKind;
}

export interface MetaMenuItemCollectionKind extends MetaMenuItem {
	collectionSomethingAlias: string;
	hideRoot?: boolean;
}
